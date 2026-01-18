import pytesseract
from PIL import Image
import requests
from io import BytesIO
import logging

logger = logging.getLogger(__name__)

def download_image(file_url: str) -> Image.Image:
    try:
        if file_url.startswith('http://') or file_url.startswith('https://'):
            response = requests.get(file_url, timeout=30)
            response.raise_for_status()
            image = Image.open(BytesIO(response.content))
        else:
            image = Image.open(file_url)
        return image
    except Exception as e:
        logger.error(f"Failed to load image: {str(e)}")
        raise


def extract_all_text(file_url: str) -> dict:
    try:
        # Download/load image
        logger.info(f"Loading image from: {file_url}")
        image = download_image(file_url)

        # Perform OCR - extract all text
        logger.info("Performing OCR extraction")
        text = pytesseract.image_to_string(image)

        # Get detailed OCR data with confidence scores
        ocr_data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)

        # Extract words and their confidences
        words = []
        confidences = []

        for i, word in enumerate(ocr_data['text']):
            conf = int(ocr_data['conf'][i])
            if conf > 0 and word.strip():  # Only valid words with confidence
                words.append(word.strip())
                confidences.append(conf)

        # Calculate average confidence
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0

        logger.info(f"OCR extracted {len(words)} words with avg confidence {avg_confidence:.1f}%")
        logger.debug(f"Extracted text: {text[:200]}...")  # Log first 200 chars

        return {
            "success": True,
            "confidence": avg_confidence / 100.0,  # Normalize to 0-1
            "text": text,
            "words": words,
            "word_count": len(words)
        }

    except Exception as e:
        logger.error(f"OCR extraction failed: {str(e)}")
        return {
            "success": False,
            "confidence": 0.0,
            "text": "",
            "words": [],
            "word_count": 0,
            "error": str(e)
        }
