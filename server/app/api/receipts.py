import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads" / "receipts"
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}


@router.post("/upload")
async def upload_receipt(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing receipt filename")

    extension = Path(file.filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported receipt file type")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    receipt_id = f"{uuid.uuid4().hex}{extension}"
    destination = UPLOAD_DIR / receipt_id

    contents = await file.read()
    destination.write_bytes(contents)

    return {
        "receipt_id": receipt_id,
        "filename": file.filename,
    }
