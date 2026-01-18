# Quick Start

## Step 1: Install Tesseract OCR

### Windows
1. Download: https://github.com/UB-Mannheim/tesseract/wiki

### macOS
```bash
brew install tesseract
```

## Step 2: Install Dependencies

```bash
cd ml_service
pip install -r requirements.txt
```

## Step 3: Start Service

```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```