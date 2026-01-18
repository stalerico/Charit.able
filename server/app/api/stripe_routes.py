import base64
import os
import secrets
import time
from pathlib import Path
from urllib.parse import urlencode

import requests
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(BASE_DIR / ".env")

TREASURY_ADDR = os.getenv("WALLET_ADDRESS")

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
    if not TREASURY_ADDR:
        raise HTTPException(status_code=500, detail="Missing WALLET_ADDRESS")

    try:
        client_ip = request.client.host if request.client else "127.0.0.1"
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

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
