import logging
import os
from typing import Annotated

from fastapi import APIRouter, HTTPException, UploadFile, Body, Request, FastAPI, File
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse

from cobot.llm.svg_api import get_svg_from_prompt
from cobot.svg.image_to_svg import generate_from_image

UPLOAD_DIR = "./cobot/robot/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

logger = logging.getLogger(__name__)

app = FastAPI()
router = APIRouter()

# Mount static files on the FastAPI instance (not on APIRouter)
app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")


@router.post("/generate_svg_from_prompt")
async def generate_svg_from_prompt(text: str = Body(..., embed=True)):
    """API endpoint to generate SVG from a text prompt."""
    try:
        svg = get_svg_from_prompt(text)
        return svg
    except Exception as e:
        logger.error(f"Error generating SVG: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/convert_to_svg")
async def convert_to_svg(
        request: Request,
        img_file: Annotated[UploadFile, File(description="Image that should be converted to SVG.")],
):
    """Convert an uploaded image to SVG and return its URL."""
    msg = f"Received file: {img_file.filename}"
    logger.debug(msg)

    file_dir = os.path.abspath(os.path.join(os.getcwd(), UPLOAD_DIR))
    file_location = os.path.join(file_dir, img_file.filename)

    with open(file_location, "wb") as f:
        f.write(await img_file.read())

    logger.info("Successfully stored file.")

    # Generate SVG from the image
    generate_from_image(file_location)

    # Use request instance for URL construction
    image_url = request.url_for("get_image", image_name=img_file.filename+ ".svg")

    return str(image_url)


@router.get("/image/{image_name}")
async def get_image(image_name: str):
    """Retrieve a generated SVG image."""
    image_path = os.path.join(UPLOAD_DIR, image_name)
    logger.info(f"Serving file: {image_path}")

    if not os.path.isfile(image_path):
        raise HTTPException(status_code=404, detail="Image not found")

    return FileResponse(image_path, media_type="image/svg+xml")
