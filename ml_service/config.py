import os
from dotenv import load_dotenv

load_dotenv()

# Service Configuration
SERVICE_NAME = "ML Category Verification Service"
SERVICE_VERSION = "2.0.0"
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", 8001))

# Tesseract Configuration
TESSERACT_CMD = os.getenv("TESSERACT_CMD", None)

# OCR Settings
OCR_TIMEOUT = int(os.getenv("OCR_TIMEOUT", 30))
OCR_LANGUAGE = os.getenv("OCR_LANGUAGE", "eng")

# OpenRouter AI Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")

# HTTP Settings
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", 30))
MAX_IMAGE_SIZE = int(os.getenv("MAX_IMAGE_SIZE", 10 * 1024 * 1024))

# Logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")