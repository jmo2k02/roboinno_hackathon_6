from loguru import logger
from fastapi import APIRouter, HTTPException

from cobot.schemas.gpt import TextToSumUp, SumUpResponse
from cobot.llm.deps import OpenAIDep

router = APIRouter()


@router.post("summarize", response_model=SumUpResponse)
async def summarize_text(text: TextToSumUp, openai_client: OpenAIDep):
    try:
        # Call OpenAI API for summarization
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",  # Or another appropriate model
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that summarizes text concisely.",
                },
                {
                    "role": "user",
                    "content": f"Please summarize the following text:\n\n{text.text}",
                },
            ],
            max_tokens=150,
        )

        # Extract the summary from the response
        summary = response.choices[0].message.content.strip()

        return SumUpResponse(text=summary)

    except Exception as e:
        logger.error(f"Error summarizing text: {str(e)}")

        # Return appropriate error
        msg = "Failed to summarize text. Please try again later."
        raise HTTPException(status_code=500, detail=msg) from e
