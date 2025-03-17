import subprocess
from typing import Annotated
from pathlib import Path
from loguru import logger
from fastapi import APIRouter, UploadFile, File, HTTPException, status
import os


router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

SCRIPT_PATH = "/mnt/data/DrawSvgOnBoard_robo-innovate.py"

@router.post("/run_with_svg")
async def run_robot_using_svg(
    svg_file: Annotated[
        UploadFile, File(description="SVG file that is used to run the model")
    ],
):
    mime_type = svg_file.content_type
    if not mime_type == "image/svg+xml":
        msg = f"Wrong mime type provided '{mime_type}' this endpoint only accepts image/svg+xml"
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail=msg
        )
    msg = f"Got file {svg_file.filename}"
    logger.debug(msg)
    file_dir = os.path.abspath(os.path.join(os.getcwd(), "./uploads"))
    file_location = os.path.join(file_dir, svg_file.filename)

    with open(file_location, "wb") as f:
        f.write(await svg_file.read())

    try:
        # Run the script synchronously and wait until it completes
        result = subprocess.run(["python3", SCRIPT_PATH, file_location], capture_output=True, text=True, check=True)

        logger.info(f"Processing completed for {svg_file.filename}")
        return {
            "filename": svg_file.filename,
            "stdout": result.stdout.strip(),
            "stderr": result.stderr.strip(),
        }

    except subprocess.CalledProcessError as e:
        logger.error(f"Script execution failed: {e.stderr}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {e.stderr}")

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")



@router.post("/run-with-image")
async def run_robot_using_image(
    img_file: Annotated[
        UploadFile, File(description="Image file that should be used by the robot to paint")
    ]
):
    """Take an image file as input turn it into a svg, then make the robot paint it"""
    # TODO Implement
    raise NotImplementedError()