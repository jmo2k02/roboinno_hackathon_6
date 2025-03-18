from typing_extensions import override

from cobot.services.base import ServiceFactory
from cobot.services.settings.service import SettingsService


class SettingsServiceFactory(ServiceFactory):
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        super().__init__(SettingsService)


    @override
    def create(self):
        return SettingsService.initialize()
    