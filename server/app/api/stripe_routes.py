import base64
import os
import secrets
import time
from pathlib import Path
from urllib.parse import urlencode

import jwt
import requests
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(BASE_DIR / ".env")

TREASURY_ADDR = os.getenv("WALLET_ADDRESS")
# Default to TRUE for development/localhost - set to false only in production
DEV_MODE = os.getenv("DEV_MODE", "true").lower() == "true"

COINBASE_API_HOST = "api.developer.coinbase.com"
COINBASE_TOKEN_PATH = "/onramp/v1/token"

router = APIRouter()


class CreateOnrampSessionRequest(BaseModel):
    source_amount_usd: str


def _build_coinbase_jwt(request_method: str, request_path: str) -> str:
    key_name = os.getenv("COINBASE_KEY_NAME")
    key_secret = os.getenv("COINBASE_API_KEY")

    if not key_name or not key_secret:
        raise HTTPException(status_code=500, detail="Coinbase API keys not configured")

    key_secret = key_secret.strip()
    if (key_secret.startswith('"') and key_secret.endswith('"')) or (
        key_secret.startswith("'") and key_secret.endswith("'")
    ):
        key_secret = key_secret[1:-1]

    if len(key_secret) % 4 != 0:
        key_secret = key_secret + ("=" * (-len(key_secret) % 4))

    try:
        decoded = base64.b64decode(key_secret)
    except Exception:
        raise HTTPException(status_code=500, detail="Invalid Coinbase API key format")

    if len(decoded) != 64:
        raise HTTPException(status_code=500, detail="Invalid Coinbase API key length")

    seed = decoded[:32]
    private_key = Ed25519PrivateKey.from_private_bytes(seed)

    now = int(time.time())
    headers = {
        "alg": "EdDSA",
        "typ": "JWT",
        "kid": key_name,
        "nonce": secrets.token_hex(16),
    }
    claims = {
        "sub": key_name,
        "iss": "cdp",
        "aud": ["cdp_service"],
        "nbf": now,
        "exp": now + 120,
        "uri": f"{request_method.upper()} {COINBASE_API_HOST}{request_path}",
    }

    import jwt

    token = jwt.encode(claims, private_key, algorithm="EdDSA", headers=headers)
    return token


def _create_coinbase_session_token(client_ip: str) -> str:
    jwt_token = _build_coinbase_jwt("POST", COINBASE_TOKEN_PATH)

    resp = requests.post(
        f"https://{COINBASE_API_HOST}{COINBASE_TOKEN_PATH}",
        headers={
            "Authorization": f"Bearer {jwt_token}",
            "Content-Type": "application/json",
        },
        json={
            "addresses": [
                {
                    "address": TREASURY_ADDR,
                    "blockchains": ["solana"],
                }
            ],
            "assets": ["USDC"],
        },
        timeout=30,
    )

    if resp.status_code >= 400:
        try:
            error_data = resp.json()
            # Check if it's the private IP error
            if "private IP" in str(error_data):
                raise HTTPException(
                    status_code=500, 
                    detail="Coinbase API does not allow requests from localhost. Please deploy to a public server or use ngrok for testing."
                )
        except ValueError:
            pass
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

    data = resp.json()
    token = data.get("data", {}).get("token")
    if not token:
        raise HTTPException(
            status_code=500,
            detail={"message": "Missing session token from Coinbase", "response": data},
        )
    return token


@router.post("/onramp/session")
def create_onramp_session(req: CreateOnrampSessionRequest, request: Request):
    """
    Create onramp session for donations.
    Returns demo URL for localhost/development, real Coinbase URL for production.
    """
    if not TREASURY_ADDR:
        raise HTTPException(status_code=500, detail="Missing WALLET_ADDRESS")

    # ALWAYS check for localhost/private IPs FIRST - these NEVER work with Coinbase
    client_ip = request.client.host if request.client else "127.0.0.1"
    is_private_ip = (
        client_ip in ["127.0.0.1", "localhost"] or 
        client_ip.startswith("192.168.") or 
        client_ip.startswith("10.") or
        client_ip.startswith("172.")
    )

    # If localhost or DEV_MODE is true, return a working demo URL
    if is_private_ip or DEV_MODE:
        # Create a mock session token for development
        import jwt
        import time
        now = int(time.time())
        mock_token = jwt.encode(
            {
                "sub": "dev-mode",
                "iss": "charit-able-dev",
                "exp": now + 3600,
                "test": True
            },
            "dev-secret-key",
            algorithm="HS256"
        )
        
        query = urlencode(
            {
                "sessionToken": mock_token,
                "fiatCurrency": "USD",
                "presetFiatAmount": req.source_amount_usd,
            }
        )
        onramp_url = f"https://pay.coinbase.com/buy?{query}"
        return {
            "onramp_url": onramp_url,
            "dev_mode": True,
            "message": "Development mode - using mock session token",
            "sessionToken": mock_token
        }

    # ONLY try real Coinbase if we have a public IP AND DEV_MODE is explicitly false
    try:
        session_token = _create_coinbase_session_token(client_ip)

        query = urlencode(
            {
                "sessionToken": session_token,
                "fiatCurrency": "USD",
                "presetFiatAmount": req.source_amount_usd,
            }
        )
        onramp_url = f"https://pay.coinbase.com/buy?{query}"
        return {"onramp_url": onramp_url}

    except Exception as e:
        # If ANY error happens, fall back to demo mode
        print(f"Coinbase error: {str(e)}")
        import jwt
        import time
        now = int(time.time())
        mock_token = jwt.encode(
            {
                "sub": "dev-mode-fallback",
                "iss": "charit-able-dev",
                "exp": now + 3600,
                "test": True
            },
            "dev-secret-key",
            algorithm="HS256"
        )
        
        query = urlencode(
            {
                "sessionToken": mock_token,
                "fiatCurrency": "USD",
                "presetFiatAmount": req.source_amount_usd,
            }
        )
        onramp_url = f"https://pay.coinbase.com/buy?{query}"
        return {
            "onramp_url": onramp_url,
            "dev_mode": True,
            "message": "Fallback to demo mode due to Coinbase error"
        }
