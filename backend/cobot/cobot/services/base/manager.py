from __future__ import annotations

import inspect
import importlib
from typing import TYPE_CHECKING
from loguru import logger

if TYPE_CHECKING:
    from cobot.services.base import Service, ServiceFactory
    from cobot.services.types import ServiceType

# Inspired by https://github.com/langflow-ai/langflow
class ServiceManager:
    """Manages the different services available"""

    def __init__(self) -> None:
        self.services: dict[str, Service] = {}
        self.factories: dict[str, ServiceFactory] = {}
        self._register_factories()

    def _add_factory(self, factory: ServiceFactory) -> None:
        """Add a service to the manager"""
        self.factories[factory.service_class.slug] = factory

    def _add_service(self, service: Service) -> None:
        """Add a service to the manager"""
        self.services[service.slug] = service

    def all(self) -> list[Service]:
        """Get all services"""
        return list(self.services.values())

    def get(self, slug: ServiceType) -> Service:
        """Get a service by its slug"""
        if slug not in self.services:
            self._create_service(slug)
        return self.services[slug]
    
    def _create_service(self, slug: ServiceType) -> None:
        """Create a service by type"""
        if slug not in self.factories:
            raise ValueError(f"Service type {slug} not found")
        factory = self.factories[slug]

        depending_services: dict[str, Service] = {}

        # Resolve dependencies
        for dep in factory.service_class.dependencies:
            depending_services[f"{dep.value}_service"] = self.get(dep)

        self.services[slug] = factory.create(**depending_services)
        self.services[slug].set_ready()

    def _register_factories(self) -> None:
        """Register all services"""
        from cobot.services.base import ServiceFactory
        from cobot.services.types import ServiceType

        service_names = [ServiceType(service_type) for service_type in ServiceType]
        service_module = "cobot.services"

        for name in service_names:
            try:
                module_name = f"{service_module}.{name.value}"
                module = importlib.import_module(module_name)

                # find all ServiceFactories
                for name, obj in inspect.getmembers(module, inspect.isclass):
                    if issubclass(obj, ServiceFactory):
                        msg = f"Registering ServiceFactory: {name}, {obj}"
                        logger.debug(msg)
                        self._add_factory(obj())

            except Exception as exc:
                print(exc)
                msg = f"Error loading service {name}"
                raise RuntimeError(msg)