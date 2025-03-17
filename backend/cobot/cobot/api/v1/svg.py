import logging

from fastapi import APIRouter, HTTPException, UploadFile
from fastapi.responses import Response
from fastapi import APIRouter, HTTPException
from fastapi import FastAPI, File, UploadFile
import subprocess
import os

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/generate_from_prompt")
async def generate_svg_from_prompt(md_text: str):
    """API endpoint to generate SVG from prompt."""
    try:
        return Response()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
