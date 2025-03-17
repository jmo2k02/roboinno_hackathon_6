from typing import Annotated
from loguru import logger
from fastapi import Depends, Query

from cobot.services.deps import get_settings_service
from cobot.exceptions import AuthorizationError
from .model import Token, TokenData


def validate_token(token: str = Query(..., description="Auth token")) -> TokenData:
    environment = get_settings_service().app_settings.ENVIRONMENT
    if environment == "dev":
        logger.info("Token validated because dev")
        return TokenData(
            email="dev@dev.de"
        )
    else:
        # TODO add proper authentication
        raise AuthorizationError("Token not authorized")
ValidateTokenDep = Annotated[TokenData, Depends(validate_token)]
