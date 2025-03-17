from typing import Annotated
from pathlib import Path
from loguru import logger
from fastapi import APIRouter, UploadFile, File, HTTPException, status


router = APIRouter()


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
    
    