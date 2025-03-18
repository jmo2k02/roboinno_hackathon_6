from pydantic import BaseModel


class TextToSumUp(BaseModel):
    text: str
    
class SumUpResponse(BaseModel):
    text: str