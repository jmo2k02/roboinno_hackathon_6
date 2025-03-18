from abc import ABC

from cobot.services.types import ServiceType

class Service(ABC):
    name: str
    slug: str
    description: str
    ready: bool = False

    dependencies: list[ServiceType] = []
    """List of other services that are needed for this service to work"""

    def set_ready(self):
        self.ready = True

    def is_ready(self):
        return self.ready
