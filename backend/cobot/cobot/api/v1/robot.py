from typing import Annotated
from pathlib import Path
from loguru import logger
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from cobot.simulate.getPathFromDrawSvg import getPathFromSvg
from cobot.simulate.simMinimalExample import simMinimalExample


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

    getPathFromSvg()
    simMinimalExample()

@router.post("/preview_svg")
async def preview_svg(
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


@router.post("/run-with-image")
async def run_robot_using_image(
    img_file: Annotated[
        UploadFile, File(description="Image file that should be used by the robot to paint")
    ]
):
    """Take an image file as input turn it into a svg, then make the robot paint it"""
    # TODO Implement
    raise NotImplementedError()