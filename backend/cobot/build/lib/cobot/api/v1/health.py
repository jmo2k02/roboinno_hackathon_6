from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class JsonExample(BaseModel):
    text: str
    type: str


@router.get("/test-list", response_model=list[JsonExample])
async def return_list():
    return [{"text": "asfsd", "type": "sfsfd"}, {"text": "asfsd", "type": "sfsfd"}]
