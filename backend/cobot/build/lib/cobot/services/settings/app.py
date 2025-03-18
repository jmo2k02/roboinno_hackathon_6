from typing import Optional

from pydantic import computed_field

from ._base import BaseAppSettings


class AppSettings(BaseAppSettings):
    """Application-specific settings"""
    
    APP_NAME: str = "cobot"
    APP_VERSION: str = "0.1.0"

    @computed_field
    @property
    def OPENAPI_URL(self) -> Optional[str]:
        if self.ENVIRONMENT == "prod":
            return None
        return "/api/openapi.json"
    
    @computed_field
    @property
    def DOCS_URL(self) -> Optional[str]:
        if self.ENVIRONMENT == "prod":
            return None
        return "/api/docs"