from typing import Annotated
from fastapi import Depends
import openai

def get_openai_client() -> openai.OpenAI:
    # This could be moved to a dedicated service
    from cobot.services.deps import get_settings_service  # Adjust import path
    settings = get_settings_service().app_settings
    
    client = openai.OpenAI(
        api_key=settings.OPENAI_API_KEY,
    )
    return client

OpenAIDep = Annotated[openai.OpenAI, Depends(get_openai_client)]
