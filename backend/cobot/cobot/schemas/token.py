from typing import Annotated, Optional
from pydantic import BaseModel, Field


class Token(BaseModel):
    """Token response sent by the api to get a token"""

    access_token: Annotated[
        str, Field(description="This is a string that encodes data")
    ]
    token_type: Annotated[str, Field(description="The type of token. I.e. 'Bearer'")]


class TokenData(BaseModel):
    """The data that can be read from the access_token"""

    email: Annotated[
        Optional[str], Field(description="The email of the user who 'owns' this token")
    ]
