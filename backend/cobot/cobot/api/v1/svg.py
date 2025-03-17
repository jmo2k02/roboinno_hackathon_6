from fastapi import APIRouter, HTTPException, UploadFile
from fastapi.responses import Response
from fastapi import APIRouter, HTTPException
from fastapi import FastAPI, File, UploadFile
import subprocess
import os


router = APIRouter()


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

SCRIPT_PATH = "/mnt/data/DrawSvgOnBoard_robo-innovate.py"

@router.post("/generate_from_prompt")
async def generate_svg_from_prompt(md_text: str):
    """API endpoint to generate SVG from prompt."""
    try:
        return Response()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/process-svg/")
async def process_svg(file: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_location, "wb") as f:
        f.write(await file.read())

    result = subprocess.run(["python3", SCRIPT_PATH, file_location], capture_output=True, text=True)

    return {
        "filename": file.filename,
        "stdout": result.stdout,
        "stderr": result.stderr,
    }