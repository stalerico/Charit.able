import requests
import logging
import json
import config as cfg

logger = logging.getLogger(__name__)

# Configure OpenRouter API
OPENROUTER_API_KEY = cfg.OPENROUTER_API_KEY
OPENROUTER_MODEL = cfg.OPENROUTER_MODEL
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def verify_with_gemini(ocr_text: str, categories: list, ocr_words: list = None) -> dict:
    try:
        logger.info(f"Verifying with OpenRouter - Categories: {categories}")

        # Construct prompt
        prompt = f"""You are a verification AI that checks if a receipt or document contains specific categories of items.

**Task**: Analyze the extracted text below and determine if it contains evidence of purchases/items from the specified categories.

**Categories to verify**: {', '.join(categories)}

**Extracted text from document**:
{ocr_text}

**Instructions**:
1. Check if the text contains items, products, or references related to each category
2. For each category, determine if there's sufficient evidence in the text
3. Be reasonably flexible with matching (e.g., "medication" matches "medical supplies")
4. Return a JSON response with this exact structure:

{{
    "passed": true/false,
    "confidence": 0.0-1.0,
    "matched_categories": ["list of categories found"],
    "missing_categories": ["list of categories not found"],
    "explanation": "Brief explanation of your decision",
    "category_analysis": {{
        "category_name": {{
            "found": true/false,
            "evidence": "text showing this category was found",
            "confidence": 0.0-1.0
        }}
    }}
}}

**Rules**:
- Set "passed" to true only if ALL categories are found
- Set confidence based on how clear the evidence is
- Be strict but fair - require actual evidence, not just assumptions
- If OCR text is empty or unreadable, set passed=false with low confidence

Return ONLY valid JSON, no other text."""

        # Send request to OpenRouter
        logger.info("Sending request to OpenRouter API...")
        response = requests.post(
            url=OPENROUTER_URL,
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://charitable.app",
                "X-Title": "Charit.able",
            },
            json={
                "model": OPENROUTER_MODEL,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            },
            timeout=30
        )

        response.raise_for_status()
        response_data = response.json()

        # Extract text response from OpenRouter format
        response_text = response_data["choices"][0]["message"]["content"].strip()

        # Remove markdown code blocks if present
        if response_text.startswith('```json'):
            response_text = response_text[7:] 
        if response_text.startswith('```'):
            response_text = response_text[3:]  
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        response_text = response_text.strip()

        # Parse JSON response
        try:
            result = json.loads(response_text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse OpenRouter response as JSON: {e}")
            logger.error(f"Response text: {response_text[:500]}")
            # Fallback 
            result = {
                "passed": False,
                "confidence": 0.0,
                "matched_categories": [],
                "missing_categories": categories,
                "explanation": "Failed to parse AI response",
                "category_analysis": {}
            }

        logger.info(f"OpenRouter verification result: passed={result['passed']}, confidence={result['confidence']:.2f}")

        return result

    except Exception as e:
        logger.error(f"OpenRouter verification failed: {str(e)}")
        return {
            "passed": False,
            "confidence": 0.0,
            "matched_categories": [],
            "missing_categories": categories,
            "explanation": f"Verification error: {str(e)}",
            "category_analysis": {},
            "error": str(e)
        }
