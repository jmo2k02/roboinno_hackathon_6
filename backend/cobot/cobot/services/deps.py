
from cobot.services.base import service_manager
from cobot.services.types import ServiceType
from cobot.services.settings.service import SettingsService


def get_service(service_type: ServiceType):
    return service_manager.get(service_type)

def get_settings_service() -> SettingsService:
    return get_service(ServiceType.SETTINGS)