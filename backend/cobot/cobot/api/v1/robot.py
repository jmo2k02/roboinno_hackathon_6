from typing import Annotated
from fastapi import APIRouter, UploadFile, File


router = APIRouter()


@router.post("run_with_svg")
async def run_robot_using_svg(
    svg_file: Annotated[UploadFile, File(description="SVG file that is used to run the model")]
)