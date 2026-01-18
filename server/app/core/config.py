from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "Charit.able"
    API_V1_STR: str = "/api/v1"

    # Coinbase OnRamp Configuration
    WALLET_ADDRESS: Optional[str] = None
    COINBASE_KEY_NAME: Optional[str] = None
    COINBASE_API_KEY: Optional[str] = None

    # Solana Configuration
    SOLANA_RPC_URL: str = "https://api.mainnet-beta.solana.com"
    PLATFORM_WALLET_PRIVATE_KEY: Optional[str] = None

    # Streamflow Configuration
    STREAMFLOW_CLUSTER: str = "devnet"

    # Streamflow Node Service
    STREAMFLOW_SERVICE_URL: str = "http://localhost:3001"

    # ML Service Configuration
    ML_SERVICE_URL: str = "http://localhost:8001"

    # Database
    DATABASE_URL: str = "sqlite:///./charitable.db"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()


# Release stages configuration (as percentage of total stream amount)
RELEASE_STAGES = [
    {"index": 0, "percentage": 5},   # Stage 1: 5%
    {"index": 1, "percentage": 15},  # Stage 2: 15%
    {"index": 2, "percentage": 30},  # Stage 3: 30%
    {"index": 3, "percentage": 50},  # Stage 4: 50%
]

# Verify percentages sum to 100
assert sum(stage["percentage"] for stage in RELEASE_STAGES) == 100, "Release stages must sum to 100%"

# Lamports per SOL
LAMPORTS_PER_SOL = 1_000_000_000
