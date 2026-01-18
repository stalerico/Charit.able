from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.config import RELEASE_STAGES
from app.core.database import get_db
from app.models.stream import Proof, ProofStatus, Stream
from app.services.ml_service import ml_service
from app.services.streamflow_service import streamflow_service

router = APIRouter()


# Request/Response Models
class StartStreamRequest(BaseModel):
    fundee_public_key: str = Field(..., description="Solana public key of the fundee")
    total_amount_sol: float = Field(..., gt=0, description="Total amount of SOL for the stream")


class StartStreamResponse(BaseModel):
    stream_id: str
    current_stage: int
    status: str
    total_amount_sol: float
    initial_release: dict


class ProofSubmitRequest(BaseModel):
    stream_id: str = Field(..., description="Stream identifier")
    stage_index: int = Field(..., ge=0, le=3, description="Stage index (0-3)")
    file_url: str = Field(..., description="URL to the receipt/proof file")
    categories: Optional[List[str]] = Field(
        default=None,
        description="Categories to verify against (optional)",
    )


class ProofSubmitResponse(BaseModel):
    proof_id: int
    stream_id: str
    stage_index: int
    status: str
    verification_result: dict
    next_stage_release: Optional[dict] = None


class StageStatusResponse(BaseModel):
    index: int
    percentage: int
    amount_sol: float
    status: str
    released_at: Optional[str]


class StreamStatusResponse(BaseModel):
    stream_id: str
    fundee_public_key: str
    current_stage: int
    status: str
    total_amount_sol: float
    released_amount_sol: float
    remaining_sol: float
    released_percentage: int
    remaining_percentage: int
    is_completed: bool
    created_at: str
    updated_at: str
    stages: List[StageStatusResponse]


@router.post("/start", response_model=StartStreamResponse)
async def start_stream(request: StartStreamRequest, db: Session = Depends(get_db)):
    try:
        # Create the stream
        stream = await streamflow_service.create_stream(
            db,
            request.fundee_public_key,
            request.total_amount_sol,
        )

        # Immediately release stage 1 (index 0 = 5%)
        release_result = await streamflow_service.withdraw_stage(db, stream.stream_id, stage_index=0)

        return StartStreamResponse(
            stream_id=stream.stream_id,
            current_stage=1,
            status=stream.status.value,
            total_amount_sol=stream.total_amount_sol,
            initial_release={
                "stage": 1,
                "percentage": release_result["percentage"],
                "amount_sol": release_result["amount_sol"],
                "transaction_signature": release_result["transaction_signature"],
            },
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/proof", response_model=ProofSubmitResponse)
async def submit_proof(request: ProofSubmitRequest, db: Session = Depends(get_db)):
    # Validate stream exists
    stream = db.query(Stream).filter(Stream.stream_id == request.stream_id).first()
    if not stream:
        raise HTTPException(status_code=404, detail=f"Stream not found: {request.stream_id}")

    # Validate stage index matches current stage
    if request.stage_index != stream.current_stage:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid stage. Current stage is {stream.current_stage}, got {request.stage_index}",
        )

    # Create proof record
    proof = Proof(
        stream_id=stream.id,
        stage_index=request.stage_index,
        file_url=request.file_url,
        status=ProofStatus.PENDING,
    )
    db.add(proof)
    db.commit()
    db.refresh(proof)

    # Call ML service for verification
    verification_result = await ml_service.verify_receipt(
        campaign_id=stream.stream_id,
        file_url=request.file_url,
        categories=request.categories,
    )

    next_stage_release = None

    if not verification_result["verified"]:
        # Mark proof as rejected
        proof.status = ProofStatus.REJECTED
        proof.ml_confidence = verification_result.get("confidence", 0.0)
        proof.ml_explanation = verification_result.get("explanation", "")
        db.commit()

        return ProofSubmitResponse(
            proof_id=proof.id,
            stream_id=request.stream_id,
            stage_index=request.stage_index,
            status="rejected",
            verification_result=verification_result,
            next_stage_release=None,
        )

    # Mark proof as verified
    proof.status = ProofStatus.VERIFIED
    proof.ml_confidence = verification_result.get("confidence", 0.0)
    proof.ml_explanation = verification_result.get("explanation", "")
    proof.verified_at = datetime.utcnow()
    db.commit()

    # Calculate next stage
    next_stage_index = request.stage_index + 1

    # Check if there's a next stage
    if next_stage_index < len(RELEASE_STAGES):
        try:
            # Release next stage
            release_result = await streamflow_service.withdraw_stage(
                db, request.stream_id, next_stage_index
            )
            next_stage_release = {
                "stage": next_stage_index + 1,
                "percentage": release_result["percentage"],
                "amount_sol": release_result["amount_sol"],
                "transaction_signature": release_result["transaction_signature"],
                "total_released_percentage": release_result["total_released_percentage"],
            }
        except Exception as e:
            next_stage_release = {"error": str(e)}
    else:
        # All stages completed
        stream.status = "completed"
        db.commit()

    return ProofSubmitResponse(
        proof_id=proof.id,
        stream_id=request.stream_id,
        stage_index=request.stage_index,
        status="verified",
        verification_result=verification_result,
        next_stage_release=next_stage_release,
    )


@router.get("/{stream_id}/status", response_model=StreamStatusResponse)
def get_stream_status(stream_id: str, db: Session = Depends(get_db)):
    """
    Get the current status of a stream including all stage details.
    """
    try:
        status = streamflow_service.get_stream_status(db, stream_id)
        return StreamStatusResponse(**status)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{stream_id}/pause")
def pause_stream(stream_id: str, db: Session = Depends(get_db)):
    """Pause a stream (admin operation)."""
    try:
        stream = streamflow_service.pause_stream(db, stream_id)
        return {"stream_id": stream.stream_id, "status": stream.status.value}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{stream_id}/resume")
def resume_stream(stream_id: str, db: Session = Depends(get_db)):
    """Resume a paused stream (admin operation)."""
    try:
        stream = streamflow_service.resume_stream(db, stream_id)
        return {"stream_id": stream.stream_id, "status": stream.status.value}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{stream_id}/cancel")
async def cancel_stream(stream_id: str, db: Session = Depends(get_db)):
    """Cancel a stream and return remaining funds to sender."""
    try:
        result = await streamflow_service.cancel_stream(db, stream_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
