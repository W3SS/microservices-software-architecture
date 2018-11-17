from service_types import ServiceTypes
from inventory_service.inventory_service import InventoryService


class ServiceFactory():

    def get_service(self, service_type):
        if service_type == ServiceTypes.google:
            return InventoryService()
        elif service_type == ServiceTypes.inventory:
            return InventoryService()
