from pydantic import BaseModel

class OnrampSession(BaseModel):
    amount: int
    currency: str
     