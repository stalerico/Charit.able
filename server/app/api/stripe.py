import stripe
from fastapi import FastAPI
import os
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

stripe.api_key = os.getenv("STRIPE_API_KEY_PRIVATE")

app = FastAPI()


@app.post("/create-payment-intent")
def create_payment_intent(req:dict):
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=req["amount"], #$5.00 = 500, $9.99 = 999, etc
            currency=req["currency"],
            
        )
        return {"client_secret": payment_intent["client_secret"]}
    except stripe.error.StripeError as e:
        return {"error": str(e)}
    
        