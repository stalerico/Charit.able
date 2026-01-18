from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class StreamStatus(str, PyEnum):
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ProofStatus(str, PyEnum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


class StageStatus(str, PyEnum):
    PENDING = "pending"
    RELEASED = "released"


class Stream(Base):
    __tablename__ = "streams"

    id = Column(Integer, primary_key=True, index=True)
    stream_id = Column(String, unique=True, index=True, nullable=False)
    fundee_public_key = Column(String, nullable=False)
    current_stage = Column(Integer, default=0)
    status = Column(Enum(StreamStatus), default=StreamStatus.PAUSED)
    total_amount_sol = Column(Float, nullable=False)
    released_amount_sol = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    stages = relationship("StreamStage", back_populates="stream", cascade="all, delete-orphan")
    proofs = relationship("Proof", back_populates="stream", cascade="all, delete-orphan")


class StreamStage(Base):
    __tablename__ = "stream_stages"

    id = Column(Integer, primary_key=True, index=True)
    stream_id = Column(Integer, ForeignKey("streams.id"), nullable=False)
    stage_index = Column(Integer, nullable=False)
    percentage = Column(Integer, nullable=False)  
    amount_sol = Column(Float, nullable=False)  
    status = Column(Enum(StageStatus), default=StageStatus.PENDING)
    released_at = Column(DateTime, nullable=True)

    stream = relationship("Stream", back_populates="stages")


class Proof(Base):
    __tablename__ = "proofs"

    id = Column(Integer, primary_key=True, index=True)
    stream_id = Column(Integer, ForeignKey("streams.id"), nullable=False)
    stage_index = Column(Integer, nullable=False)
    file_url = Column(String, nullable=False)
    status = Column(Enum(ProofStatus), default=ProofStatus.PENDING)
    ml_confidence = Column(Float, nullable=True)
    ml_explanation = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)

    stream = relationship("Stream", back_populates="proofs")
