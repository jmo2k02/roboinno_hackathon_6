from __future__ import annotations

from typing import TYPE_CHECKING


if TYPE_CHECKING:
    from cobot.services.base.base import Service
from typing import Type


class ServiceFactory:
    """Base class for service factories"""

    def __init__(self, service_class: Type[Service]) -> None:
        """
        Initialize the factory with a service class.

        Args:
            service_class (Type[Service]): The service class to be used by the factory. 
                           Note that this should be the class itself, not an instance of the class.
        """
        self.service_class = service_class

    def create(self, *args, **kwargs) -> "Service":
        raise NotImplementedError