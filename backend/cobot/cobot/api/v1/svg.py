from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

router = APIRouter()

@router.post("/generate")
async def generate_svg(md_text: str):
    """API endpoint to generate SVG from prompt."""
    try:
        return Response()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
