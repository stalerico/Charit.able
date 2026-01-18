import logging
from typing import List, Optional

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


class MLVerificationService:

    def __init__(self):
        self.base_url = settings.ML_SERVICE_URL
        self.timeout = 60.0  # OCR can take time

    async def verify_receipt(
        self,
        campaign_id: str,
        file_url: str,
        categories: Optional[List[str]] = None,
    ) -> dict:
        if categories is None:
            categories = ["donation", "charity", "receipt", "payment"]

        payload = {
            "campaignId": campaign_id,
            "fileUrl": file_url,
            "categories": categories,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/verify",
                    json=payload,
                )
                response.raise_for_status()
                result = response.json()

                logger.info(
                    f"ML verification for campaign {campaign_id}: "
                    f"passed={result.get('passed')}, confidence={result.get('confidence')}"
                )

                return {
                    "verified": result.get("passed", False),
                    "confidence": result.get("confidence", 0.0),
                    "matched_categories": result.get("matched_categories", []),
                    "missing_categories": result.get("missing_categories", []),
                    "explanation": result.get("explanation", ""),
                    "ocr_text": result.get("ocr_text", ""),
                    "details": result.get("details", {}),
                }

        except httpx.HTTPStatusError as e:
            logger.error(f"ML service HTTP error: {e.response.status_code} - {e.response.text}")
            return {
                "verified": False,
                "confidence": 0.0,
                "matched_categories": [],
                "missing_categories": categories,
                "explanation": f"ML service error: {e.response.status_code}",
                "error": str(e),
            }

        except httpx.RequestError as e:
            logger.error(f"ML service connection error: {e}")
            return {
                "verified": False,
                "confidence": 0.0,
                "matched_categories": [],
                "missing_categories": categories,
                "explanation": "ML service unavailable",
                "error": str(e),
            }

    async def health_check(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/health")
                return response.status_code == 200
        except Exception:
            return False


ml_service = MLVerificationService()
