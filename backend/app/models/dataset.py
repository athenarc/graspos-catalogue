"""Dataset models."""

from beanie import Document, Indexed
from pydantic import BaseModel
from beanie import Link
from models.zenodo import Zenodo
from models.baseResourceModel import BaseResourceModel, BaseResourcePatch, BaseResourceView
from pymongo import IndexModel, TEXT


class DatasetBasicFields(BaseModel):
    url: str | None = None
    organization: str | None = None
    zenodo: Link[Zenodo] | None = None


class Dataset(DatasetBasicFields, BaseResourceModel):
    pass


class DatasetPatch(DatasetBasicFields, BaseResourcePatch):
    pass


class DatasetView(DatasetBasicFields, BaseResourceView):
    pass


class Dataset(Document, DatasetView):

    class Settings:
        name = "datasets"
        indexes = [
            # Unique slug (for URLs, routing, PATCH by slug etc)
            IndexModel(
                [("resource_url_slug", 1)],
                unique=True,
                name="resource_url_slug_unique",
            ),

        ]

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
    async def get_unique_field_values_from_zenodo(cls,
                                                  field_name: str) -> list:
        """
        Return all unique values for a given metadata field from linked Zenodo datasets.

        :param field_name: The field name in zenodo.metadata to extract unique values from.
        :return: A list of unique field values (dicts or scalars).
        """
        datasets = await cls.find_all().to_list()
        unique_values = set()

        for dataset in datasets:
            if dataset.zenodo is not None:
                await dataset.fetch_link("zenodo")
                zenodo = dataset.zenodo
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
