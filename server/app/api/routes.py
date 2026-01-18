from fastapi import APIRouter

from app.api import campaigns, receipts, streams, stripe_routes, transactions, vendors

router = APIRouter()

router.include_router(campaigns.router, prefix="/campaigns", tags=["campaigns"])
router.include_router(vendors.router, prefix="/vendors", tags=["vendors"])
router.include_router(receipts.router, prefix="/receipts", tags=["receipts"])
router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
router.include_router(stripe_routes.router, tags=["onramp"])
router.include_router(streams.router, prefix="/streams", tags=["streams"])

