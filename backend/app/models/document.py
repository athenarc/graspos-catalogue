"""Document models."""

from beanie import Document
from datetime import datetime
from pydantic import BaseModel
from beanie import PydanticObjectId, Link
from datetime import datetime
from typing import Optional, List, Optional
from models.shared import GeographicalCoverage
from models.zenodo import Zenodo
from models.scope import Scope
from models.assessment import Assessment


class Documents(BaseModel):
    source: str
    format: str | None = None
    url: str | None = None
    created: Optional[datetime] = None
    zenodo: Link[Zenodo] | None = None
    scopes: List[Link[Scope]] | None = None
    date_last_updated: Optional[datetime] = None
    metadata_last_updated: Optional[datetime] = None
    geographical_coverage: Optional[List[Link[GeographicalCoverage]]] = None
    assessments: List[Link[Assessment]] | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class DocumentsPatch(BaseModel):
    source: str | None = None
    format: str | None = None
    url: str | None = None
    created: Optional[datetime] | None = None
    scopes: List[Link[Scope]] | None = None
    geographical_coverage: Optional[List[Link[GeographicalCoverage]]] = None
    assessments: List[Link[Assessment]] | None = None
    date_last_updated: Optional[datetime] | None = None
    metadata_last_updated: Optional[datetime] | None = None
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class DocumentView(BaseModel):
    source: str | None = None
    format: str | None = None
    organization: str | None = None
    visibility: str | None = None
    zenodo: Link[Zenodo] | None = None
    scopes: List[Link[Scope]] | None = None
    geographical_coverage: Optional[List[Link[GeographicalCoverage]]] = None
    assessments: List[Link[Assessment]] | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()
    approved: bool | None = None
    owner: PydanticObjectId | None = None


class Documents(Document, DocumentView):

    class Settings:
        name = "documents"

    class Config:
        json_schema_extra = {
            "example": {
                "source": "https://www.example.com/api/2131231",
                "description": "example-description",
                "approved": "True/False",
                "created": "01/01/2020",
                "data_last_updated": "01/01/2020",
                "metadata_last_updated": "01/01/2020",
                "created_at": "01/01/2020",
                "updated_at": "01/01/2020",
                "approved": "True/False",
                "owner": "user id"
            }
        }

    @classmethod
    async def get_unique_field_values_from_zenodo(cls,
                                                  field_name: str) -> list:
        """
        Return all unique values for a given metadata field from linked Zenodo documents.

        :param field_name: The field name in zenodo.metadata to extract unique values from.
        :return: A list of unique field values (dicts or scalars).
        """
        documents = await cls.find_all().to_list()
        unique_values = set()

        for document in documents:
            if document.zenodo is not None:
                await document.fetch_link("zenodo")
                zenodo = document.zenodo
                metadata = zenodo.metadata

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
