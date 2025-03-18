from typing import Optional, Literal
from pydantic import computed_field
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class BaseAppSettings(BaseSettings):
    """Base settings class with common configuration"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )

    # Common settings needed by multiple classes
    ENVIRONMENT: Literal["dev", "stage", "prod"] = "dev"
    TESTING: bool = bool(0)


    
    
    
