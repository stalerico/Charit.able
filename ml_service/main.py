from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import logging
from typing import List, Optional
from ocr_extractor import extract_all_text
from gemini_verifier import verify_with_gemini

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ML Category Verification Service", version="2.0.0")

class VerificationRequest(BaseModel):
    campaignId: str
    fileUrl: str 
    categories: List[str]  


class VerificationResponse(BaseModel):
    passed: bool
    confidence: float
    matched_categories: List[str]
    missing_categories: List[str]
    explanation: str
    ocr_text: str
    ocr_words: List[str]
    details: Optional[dict] = None


@app.get("/")
async def root():
    return {
        "service": "ML Category Verification Service",
        "version": "2.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ml-category-verification"}

@app.post("/verify", response_model=VerificationResponse)
async def verify_categories(request: VerificationRequest):
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
                explanation="Failed to extract text from image",
                ocr_text="",
                ocr_words=[],
                details={"error": ocr_result.get("error")}
            )

        extracted_text = ocr_result["text"]
        extracted_words = ocr_result["words"]
        ocr_confidence = ocr_result["confidence"]

        logger.info(f"OCR extracted {len(extracted_words)} words (confidence: {ocr_confidence:.2f})")

        # Step 2: Verify with Gemini AI
        logger.info("Step 2: Verifying categories with Gemini AI")
        gemini_result = verify_with_gemini(
            ocr_text=extracted_text,
            categories=request.categories,
            ocr_words=extracted_words
        )

        # Build response
        passed = gemini_result.get("passed", False)
        confidence = gemini_result.get("confidence", 0.0)
        matched = gemini_result.get("matched_categories", [])
        missing = gemini_result.get("missing_categories", request.categories)
        explanation = gemini_result.get("explanation", "No explanation provided")

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
                "category_analysis": gemini_result.get("category_analysis", {}),
                "gemini_raw": gemini_result
            }
        )

    except Exception as e:
        logger.error(f"Error processing verification: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Verification processing failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
