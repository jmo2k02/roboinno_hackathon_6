from __future__ import annotations

from cobot.services.base import Service

from .app import AppSettings


class SettingsService(Service):

    name = "Settings"
    slug = "settings"
    description = "Settings service"

    def __init__(
        self,
        app_settings: AppSettings,
    ):
        self.app_settings = app_settings

    @classmethod
    def initialize(cls) -> SettingsService:
        app_settings = AppSettings()
        return cls(app_settings)
