import logging
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import config as cfg
from gemini_verifier import verify_with_gemini
from ocr_extractor import extract_all_text

# Configure logging
logging.basicConfig(
    level=getattr(logging, cfg.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=cfg.SERVICE_NAME,
    version=cfg.SERVICE_VERSION,
    description="ML service for verifying donation receipts and proofs for Charit.able streams",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VerificationRequest(BaseModel):
    campaignId: str = Field(..., description="Campaign/Stream ID")
    fileUrl: str = Field(..., description="URL or path to the receipt image")
    categories: List[str] = Field(
        default=["donation", "charity", "receipt", "payment"],
        description="Categories to verify against",
    )


class VerificationResponse(BaseModel):
    passed: bool
    confidence: float
    matched_categories: List[str]
    missing_categories: List[str]
    explanation: str
    ocr_text: str
    ocr_words: List[str]
    details: Optional[dict] = None


class StreamProofRequest(BaseModel):
    stream_id: str = Field(..., description="Stream ID from backend")
    stage_index: int = Field(..., ge=0, le=3, description="Stage index being verified")
    file_url: str = Field(..., description="URL or path to the proof image")
    expected_categories: List[str] = Field(
        default=["receipt", "purchase", "donation"],
        description="Expected categories for this stage",
    )


class StreamProofResponse(BaseModel):
    stream_id: str
    stage_index: int
    verified: bool
    confidence: float
    matched_categories: List[str]
    missing_categories: List[str]
    explanation: str
    ocr_text: str
    recommendation: str


@app.get("/")
async def root():
    return {
        "service": cfg.SERVICE_NAME,
        "version": cfg.SERVICE_VERSION,
        "status": "running",
        "endpoints": {
            "verify": "POST /verify - General receipt verification",
            "verify_stream_proof": "POST /verify/stream - Stream stage proof verification",
            "health": "GET /health - Health check",
        },
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ml-verification", "version": cfg.SERVICE_VERSION}


@app.post("/verify", response_model=VerificationResponse)
async def verify_categories(request: VerificationRequest):
    """
    Verify if a receipt/document contains specific categories.
    Used by the backend to validate proofs for stage releases.
    """
    try:
        logger.info(f"Processing verification for campaign: {request.campaignId}")
        logger.info(f"Categories to verify: {request.categories}")

        # Step 1: Extract text via OCR
        logger.info("Step 1: Extracting text via OCR")
        ocr_result = extract_all_text(request.fileUrl)

        if not ocr_result.get("success"):
            return VerificationResponse(
                passed=False,
                confidence=0.0,
                matched_categories=[],
                missing_categories=request.categories,
                explanation=f"Failed to extract text from image: {ocr_result.get('error', 'Unknown error')}",
                ocr_text="",
                ocr_words=[],
                details={"error": ocr_result.get("error")},
            )

        extracted_text = ocr_result["text"]
        extracted_words = ocr_result["words"]
        ocr_confidence = ocr_result["confidence"]

        logger.info(f"OCR extracted {len(extracted_words)} words (confidence: {ocr_confidence:.2f})")

        # Step 2: Verify with AI
        logger.info("Step 2: Verifying categories with AI")
        ai_result = verify_with_gemini(
            ocr_text=extracted_text,
            categories=request.categories,
            ocr_words=extracted_words,
        )

        # Build response
        passed = ai_result.get("passed", False)
        confidence = ai_result.get("confidence", 0.0)
        matched = ai_result.get("matched_categories", [])
        missing = ai_result.get("missing_categories", request.categories)
        explanation = ai_result.get("explanation", "No explanation provided")

        logger.info(f"Verification complete: passed={passed}, confidence={confidence:.2f}")
        logger.info(f"Matched: {matched}, Missing: {missing}")

        return VerificationResponse(
            passed=passed,
            confidence=confidence,
            matched_categories=matched,
            missing_categories=missing,
            explanation=explanation,
            ocr_text=extracted_text,
            ocr_words=extracted_words,
            details={
                "ocr_confidence": ocr_confidence,
                "word_count": len(extracted_words),
                "category_analysis": ai_result.get("category_analysis", {}),
            },
        )

    except Exception as e:
        logger.error(f"Error processing verification: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Verification processing failed: {str(e)}")


@app.post("/verify/stream", response_model=StreamProofResponse)
async def verify_stream_proof(request: StreamProofRequest):
    """
    Verify a proof for a specific stream stage.
    Returns a recommendation for whether to release the next stage.
    """
    try:
        logger.info(f"Verifying proof for stream {request.stream_id}, stage {request.stage_index}")

        # Extract text via OCR
        ocr_result = extract_all_text(request.file_url)

        if not ocr_result.get("success"):
            return StreamProofResponse(
                stream_id=request.stream_id,
                stage_index=request.stage_index,
                verified=False,
                confidence=0.0,
                matched_categories=[],
                missing_categories=request.expected_categories,
                explanation=f"OCR failed: {ocr_result.get('error', 'Unknown error')}",
                ocr_text="",
                recommendation="REJECT - Unable to read proof document",
            )

        extracted_text = ocr_result["text"]
        extracted_words = ocr_result["words"]
        ocr_confidence = ocr_result["confidence"]

        # Verify with AI
        ai_result = verify_with_gemini(
            ocr_text=extracted_text,
            categories=request.expected_categories,
            ocr_words=extracted_words,
        )

        passed = ai_result.get("passed", False)
        confidence = ai_result.get("confidence", 0.0)
        matched = ai_result.get("matched_categories", [])
        missing = ai_result.get("missing_categories", request.expected_categories)
        explanation = ai_result.get("explanation", "")

        # Generate recommendation
        if passed and confidence >= 0.7:
            recommendation = "APPROVE - Proof verified with high confidence. Release next stage."
        elif passed and confidence >= 0.5:
            recommendation = "APPROVE_WITH_REVIEW - Proof verified but confidence is moderate. Consider manual review."
        elif confidence >= 0.3:
            recommendation = "MANUAL_REVIEW - Low confidence. Recommend manual verification before release."
        else:
            recommendation = "REJECT - Proof does not meet verification criteria."

        logger.info(f"Stream proof verification: {recommendation}")

        return StreamProofResponse(
            stream_id=request.stream_id,
            stage_index=request.stage_index,
            verified=passed,
            confidence=confidence,
            matched_categories=matched,
            missing_categories=missing,
            explanation=explanation,
            ocr_text=extracted_text,
            recommendation=recommendation,
        )

    except Exception as e:
        logger.error(f"Stream proof verification failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Stream proof verification failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=cfg.API_HOST, port=cfg.API_PORT)
