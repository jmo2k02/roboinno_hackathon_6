import logging

from fastapi import APIRouter, HTTPException, UploadFile, Body
from fastapi.responses import Response
from fastapi import APIRouter, HTTPException
from fastapi import FastAPI, File, UploadFile
import subprocess
import os
from cobot.llm.svg_api import get_svg_from_prompt

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/generate_svg_from_prompt")
async def generate_svg_from_prompt(text: str = Body(..., embed=True)):
    """API endpoint to generate SVG from prompt."""
    try:
        svg = get_svg_from_prompt(text)
        return svg
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

