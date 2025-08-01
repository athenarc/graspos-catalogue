"""Service models."""

from beanie import Document
from datetime import datetime
from pydantic import BaseModel
from beanie import PydanticObjectId, Link
from datetime import datetime
from models.openaire import OpenAIRE
from models.zenodo import Zenodo
from models.scope import Scope
from typing import List, Optional
from models.shared import GeographicalCoverage
from models.assessment import Assessment


class Service(BaseModel):
    doi: str | None = None
    source: str | None = None
    service_type: str | None = None
    trl: object | None = None
    openaire: Link[OpenAIRE] | None = None
    zenodo: Link[Zenodo] | None = None
    scopes: List[Link[Scope]] | None = None
    geographical_coverage: Optional[List[Link[GeographicalCoverage]]] = None
    assessments: List[Link[Assessment]] | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class ServicePatch(BaseModel):
    approved: bool | None = None
    service_type: str | None = None
    trl: object | None = None
    owner: PydanticObjectId | None = None
    scopes: List[Link[Scope]] | None = None
    geographical_coverage: Optional[List[Link[GeographicalCoverage]]] = None
    assessments: List[Link[Assessment]] | None = None


class ServiceView(BaseModel):
    doi: str | None = None
    source: str | None = None
    service_type: str | None = None
    openaire: Link[OpenAIRE] | None = None
    trl: object | None = None
    zenodo: Link[Zenodo] | None = None
    scopes: List[Link[Scope]] | None = None
    geographical_coverage: Optional[List[Link[GeographicalCoverage]]] = None
    assessments: List[Link[Assessment]] | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class Service(Document, ServiceView):

    class Settings:
        name = "services"

    class Config:
        json_schema_extra = {
            "example": {
                "title": "example-name",
                "source": "https://www.example.com/api/2131231",
                "description": "example-description",
                "tags": "",
                "license": "",
                "organization": "",
                "visibility": "public/private",
                "version": "",
                "authors": "",
                "api_url": "",
                "api_url_instructions": "",
                "documentation_url": "",
                "contact_person": "",
                "contact_person_email": "",
                "created_at": "01/01/2020",
                "updated_at": "01/01/2020",
                "approved": "True/False",
                "owner": "user id"
            }
        }

    @classmethod
    async def get_unique_field_values_from_openaire(cls,
                                                    field_name: str) -> list:
        """
        Return all unique values for a given metadata field from linked OpenAIRE services.

        :param field_name: The field name in openaire.metadata to extract unique values from.
        :return: A list of unique field values (dicts or scalars).
        """
        services = await cls.find_all().to_list()
        unique_values = set()

        for service in services:
            if service.openaire is not None:
                await service.fetch_link("openaire")
                openaire = service.openaire
                metadata = openaire.metadata

                if metadata:
                    value = getattr(metadata, field_name, None)

                    if isinstance(value, list):
                        for item in value:
                            if isinstance(item, dict):
                                unique_values.add(frozenset(item.items()))
                            else:
                                unique_values.add(item)
                    elif isinstance(value, dict):
                        unique_values.add(frozenset(value.items()))
                    elif value is not None:
                        unique_values.add(value)

        # Convert any frozen dicts back to regular dicts
        result = [
            dict(item) if isinstance(item, frozenset) else item
            for item in unique_values
        ]
        return result

    @classmethod
    async def get_unique_field_values(cls, field_name: str) -> list:
        """
        Return all unique values for a given field directly from the service documents.

        :param field_name: The field name in the service document to extract unique values from.
        :return: A list of unique field values (dicts or scalars).
        """
        services = await cls.find_all().to_list()
        unique_values = set()

        for service in services:
            value = getattr(service, field_name, None)

            if isinstance(value, list):
                for item in value:
                    if isinstance(item, dict):
                        unique_values.add(frozenset(item.items()))
                    else:
                        unique_values.add(item)
            elif isinstance(value, dict):
                unique_values.add(frozenset(value.items()))
            elif value is not None:
                unique_values.add(value)

        result = [
            dict(item) if isinstance(item, frozenset) else item
            for item in unique_values
        ]
        return result
