import os
from pathlib import Path

import requests
import stripe
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(BASE_DIR / ".env")

stripe.api_key = os.getenv("STRIPE_API_KEY_PRIVATE")

TREASURY_ADDR = os.getenv("WALLET_ADDRESS")

router = APIRouter()


class CreateOnrampSessionRequest(BaseModel):
    source_amount_usd: str


@router.post("/onramp/session")
def create_onramp_session(req: CreateOnrampSessionRequest):
    if not TREASURY_ADDR:
        raise HTTPException(status_code=500, detail="Missing WALLET_ADDRESS")

    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Missing STRIPE_API_KEY_PRIVATE")

    try:
        resp = requests.post(
            "https://api.stripe.com/v1/crypto/onramp_sessions",
            headers={"Authorization": f"Bearer {stripe.api_key}"},
            data={
                "source_currency": "usd",
                "source_amount": req.source_amount_usd,
                "destination_currency": "usdc",
                "destination_network": "solana",
                "wallet_addresses[solana]": TREASURY_ADDR,
            },
            timeout=30,
        )

        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)

        session = resp.json()

        return {
            "client_secret": session["client_secret"],
            "session_id": session["id"],
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)
