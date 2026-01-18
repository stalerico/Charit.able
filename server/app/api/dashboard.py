from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from solana.rpc.api import Client

from app.core.config import LAMPORTS_PER_SOL, settings

router = APIRouter()


def _get_sol_balance(client: Client, address: str) -> float:
    try:
        response = client.get_balance(address)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to fetch balance: {exc}")

    result = response.get("result") if isinstance(response, dict) else None
    if not result or "value" not in result:
        raise HTTPException(status_code=500, detail="Invalid balance response from RPC")

    lamports = result["value"]
    return lamports / LAMPORTS_PER_SOL


@router.get("/dashboard/wallets")
def get_wallet_balances(company_wallet: Optional[str] = Query(default=None)):
    main_wallet = settings.WALLET_ADDRESS
    resolved_company_wallet = company_wallet or settings.COMPANY_WALLET_ADDRESS

    if not main_wallet:
        raise HTTPException(status_code=500, detail="Missing WALLET_ADDRESS")
    if not resolved_company_wallet:
        raise HTTPException(status_code=400, detail="Missing company wallet address")

    client = Client(settings.SOLANA_RPC_URL)

    main_balance = _get_sol_balance(client, main_wallet)
    company_balance = _get_sol_balance(client, resolved_company_wallet)

    return {
        "main_wallet": {"address": main_wallet, "balance_sol": main_balance},
        "company_wallet": {
            "address": resolved_company_wallet,
            "balance_sol": company_balance,
        },
    }
