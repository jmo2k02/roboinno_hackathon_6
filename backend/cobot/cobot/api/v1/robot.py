import subprocess
from typing import Annotated
from pathlib import Path
from loguru import logger
from fastapi import APIRouter, UploadFile, File, HTTPException, status
import os
import requests

from cobot.robot.draw_svg import draw_image

router = APIRouter()
UPLOAD_DIR = "./cobot/robot/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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
    file_dir = os.path.abspath(os.path.join(os.getcwd(), UPLOAD_DIR))
    file_location = os.path.join(file_dir, svg_file.filename)

    with open(file_location, "wb") as f:
        f.write(await svg_file.read())

    logger.info("Sucessfuly stored file.")

    try:
        #logger.info("Starting process from endpoint.")

        # Run the script synchronously and wait until it completes TODO: change to asynchronous when working
        #result = subprocess.run(["python3", SCRIPT_PATH, file_location], capture_output=True, text=True, check=True)
        draw_image(file_location)
        logger.info(f"Processing completed for {svg_file.filename}")
        return {
            "filename": svg_file.filename,
            #'"stdout": result.stdout.strip(),
            #"stderr": result.stderr.strip(),
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
    msg = f"Got file {img_file.filename}"
    logger.debug(msg)
    file_dir = os.path.abspath(os.path.join(os.getcwd(), UPLOAD_DIR))
    file_location = os.path.join(file_dir, img_file.filename)

    with open(file_location, "wb") as f:
        f.write(await img_file.read())


    logger.info("Successfully stored file.")

@router.post("/get_preview", response_model=dict)
async def get_preview(svg_file: Annotated[UploadFile, File(description="SVG file to upload for execution by robo simulation")]):

    url = "http://127.0.0.1:8001/get_preview"  # Adjust if your FastAPI server runs on a different host/port
    response = requests.post(url, files= await svg_file.read())

    return response.json()





