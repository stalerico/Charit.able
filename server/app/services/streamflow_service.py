import logging
from datetime import datetime
from typing import Optional

import httpx
from sqlalchemy.orm import Session

from app.core.config import LAMPORTS_PER_SOL, RELEASE_STAGES, settings
from app.models.stream import StageStatus, Stream, StreamStage, StreamStatus

logger = logging.getLogger(__name__)


class StreamflowService:
    """
    Service for managing payment streams via Streamflow smart contract.

    This service communicates with a Node.js service that uses the
    Streamflow SDK to interact with the on-chain program.
    """

    def __init__(self):
        self.node_service_url = settings.STREAMFLOW_SERVICE_URL

    def sol_to_lamports(self, sol_amount: float) -> int:
        return int(sol_amount * LAMPORTS_PER_SOL)

    def lamports_to_sol(self, lamports: int) -> float:
        return lamports / LAMPORTS_PER_SOL

    def calculate_stage_amount(self, total_amount: float, stage_index: int) -> float:
        if stage_index < 0 or stage_index >= len(RELEASE_STAGES):
            raise ValueError(f"Invalid stage index: {stage_index}")
        percentage = RELEASE_STAGES[stage_index]["percentage"]
        return total_amount * (percentage / 100)

    async def create_stream(
        self,
        db: Session,
        fundee_public_key: str,
        total_amount_sol: float,
    ) -> Stream:
        """
        Create a new stream that locks funds in the Streamflow smart contract.
        """
        if total_amount_sol <= 0:
            raise ValueError("Total amount must be greater than 0")

        total_lamports = self.sol_to_lamports(total_amount_sol)

        # Call Node service to create on-chain stream
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(
                    f"{self.node_service_url}/streams/create",
                    json={
                        "recipientPublicKey": fundee_public_key,
                        "totalAmountLamports": str(total_lamports),
                    },
                )
                response.raise_for_status()
                result = response.json()

                if not result.get("success"):
                    raise RuntimeError(f"Stream creation failed: {result.get('error')}")

                stream_id = result["streamId"]
                tx_signature = result["transactionSignature"]

                logger.info(f"On-chain stream created: {stream_id}")
                logger.info(f"Transaction: {tx_signature}")

            except httpx.RequestError as e:
                raise RuntimeError(f"Failed to connect to Streamflow service: {e}")
            except httpx.HTTPStatusError as e:
                error_detail = e.response.json().get("error", str(e))
                raise RuntimeError(f"Streamflow service error: {error_detail}")

        # Save to database
        stream = Stream(
            stream_id=stream_id,
            fundee_public_key=fundee_public_key,
            current_stage=0,
            status=StreamStatus.PAUSED,
            total_amount_sol=total_amount_sol,
            released_amount_sol=0.0,
        )
        db.add(stream)
        db.flush()

        # Create stage records
        for stage_config in RELEASE_STAGES:
            stage_amount = self.calculate_stage_amount(total_amount_sol, stage_config["index"])
            stage = StreamStage(
                stream_id=stream.id,
                stage_index=stage_config["index"],
                percentage=stage_config["percentage"],
                amount_sol=stage_amount,
                status=StageStatus.PENDING,
            )
            db.add(stage)

        db.commit()
        db.refresh(stream)

        return stream

    async def withdraw_stage(self, db: Session, stream_id: str, stage_index: int) -> dict:
        """
        Release funds for a specific stage via the Streamflow smart contract.
        """
        stream = db.query(Stream).filter(Stream.stream_id == stream_id).first()
        if not stream:
            raise ValueError(f"Stream not found: {stream_id}")

        if stage_index < 0 or stage_index >= len(RELEASE_STAGES):
            raise ValueError(f"Invalid stage index: {stage_index}")

        stage = (
            db.query(StreamStage)
            .filter(StreamStage.stream_id == stream.id, StreamStage.stage_index == stage_index)
            .first()
        )
        if not stage:
            raise ValueError(f"Stage {stage_index} not found")

        if stage.status == StageStatus.RELEASED:
            raise ValueError(f"Stage {stage_index} already released")

        lamports = self.sol_to_lamports(stage.amount_sol)

        # Call Node service to withdraw from on-chain stream
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(
                    f"{self.node_service_url}/streams/withdraw",
                    json={
                        "streamId": stream_id,
                        "amount": str(lamports),
                    },
                )
                response.raise_for_status()
                result = response.json()

                if not result.get("success"):
                    raise RuntimeError(f"Withdrawal failed: {result.get('error')}")

                tx_signature = result["transactionSignature"]
                logger.info(f"On-chain withdrawal successful: {tx_signature}")

            except httpx.RequestError as e:
                raise RuntimeError(f"Failed to connect to Streamflow service: {e}")
            except httpx.HTTPStatusError as e:
                error_detail = e.response.json().get("error", str(e))
                raise RuntimeError(f"Withdrawal failed: {error_detail}")

        # Update database
        stage.status = StageStatus.RELEASED
        stage.released_at = datetime.utcnow()

        stream.current_stage = stage_index
        stream.released_amount_sol += stage.amount_sol
        stream.status = StreamStatus.ACTIVE

        if stage_index == len(RELEASE_STAGES) - 1:
            stream.status = StreamStatus.COMPLETED

        db.commit()
        db.refresh(stream)

        return {
            "stream_id": stream_id,
            "stage_index": stage_index,
            "percentage": stage.percentage,
            "amount_sol": stage.amount_sol,
            "amount_lamports": lamports,
            "transaction_signature": tx_signature,
            "current_stage": stream.current_stage,
            "total_released_sol": stream.released_amount_sol,
            "total_released_percentage": sum(
                s["percentage"] for s in RELEASE_STAGES[: stage_index + 1]
            ),
        }

    async def get_onchain_stream(self, stream_id: str) -> Optional[dict]:
        """Get stream info directly from the blockchain."""
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                response = await client.get(f"{self.node_service_url}/streams/{stream_id}")
                if response.status_code == 200:
                    return response.json()
                return None
            except httpx.RequestError as e:
                logger.warning(f"Failed to get on-chain stream: {e}")
                return None

    def get_stream_status(self, db: Session, stream_id: str) -> dict:
        """Get stream status from database."""
        stream = db.query(Stream).filter(Stream.stream_id == stream_id).first()
        if not stream:
            raise ValueError(f"Stream not found: {stream_id}")

        stages = (
            db.query(StreamStage)
            .filter(StreamStage.stream_id == stream.id)
            .order_by(StreamStage.stage_index)
            .all()
        )

        released_percentage = sum(s.percentage for s in stages if s.status == StageStatus.RELEASED)

        return {
            "stream_id": stream.stream_id,
            "fundee_public_key": stream.fundee_public_key,
            "current_stage": stream.current_stage,
            "status": stream.status.value,
            "total_amount_sol": stream.total_amount_sol,
            "released_amount_sol": stream.released_amount_sol,
            "remaining_sol": stream.total_amount_sol - stream.released_amount_sol,
            "released_percentage": released_percentage,
            "remaining_percentage": 100 - released_percentage,
            "is_completed": stream.status == StreamStatus.COMPLETED,
            "created_at": stream.created_at.isoformat(),
            "updated_at": stream.updated_at.isoformat(),
            "stages": [
                {
                    "index": stage.stage_index,
                    "percentage": stage.percentage,
                    "amount_sol": stage.amount_sol,
                    "status": stage.status.value,
                    "released_at": stage.released_at.isoformat() if stage.released_at else None,
                }
                for stage in stages
            ],
        }

    def pause_stream(self, db: Session, stream_id: str) -> Stream:
        stream = db.query(Stream).filter(Stream.stream_id == stream_id).first()
        if not stream:
            raise ValueError(f"Stream not found: {stream_id}")
        stream.status = StreamStatus.PAUSED
        db.commit()
        db.refresh(stream)
        return stream

    def resume_stream(self, db: Session, stream_id: str) -> Stream:
        stream = db.query(Stream).filter(Stream.stream_id == stream_id).first()
        if not stream:
            raise ValueError(f"Stream not found: {stream_id}")
        if stream.status == StreamStatus.COMPLETED:
            raise ValueError("Cannot resume a completed stream")
        stream.status = StreamStatus.ACTIVE
        db.commit()
        db.refresh(stream)
        return stream

    async def cancel_stream(self, db: Session, stream_id: str) -> dict:
        """Cancel stream and return remaining funds to sender."""
        stream = db.query(Stream).filter(Stream.stream_id == stream_id).first()
        if not stream:
            raise ValueError(f"Stream not found: {stream_id}")

        if stream.status == StreamStatus.COMPLETED:
            raise ValueError("Cannot cancel a completed stream")

        # Call Node service to cancel on-chain
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(
                    f"{self.node_service_url}/streams/cancel",
                    json={"streamId": stream_id},
                )
                response.raise_for_status()
                result = response.json()
                tx_signature = result.get("transactionSignature", "")
            except Exception as e:
                logger.warning(f"On-chain cancel failed: {e}")
                tx_signature = ""

        stream.status = StreamStatus.CANCELLED
        db.commit()
        db.refresh(stream)

        return {
            "stream_id": stream_id,
            "status": "cancelled",
            "transaction_signature": tx_signature,
        }


streamflow_service = StreamflowService()
