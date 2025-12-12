from beanie import Document, PydanticObjectId
from datetime import datetime
from pydantic import BaseModel, Field, field_validator, model_validator
import pymongo
from pymongo import IndexModel
import pycountry


class ZenodoMetadata(BaseModel):
    title: str = Field(..., description="Title of the resource")
    doi: str = Field(..., description="Digital Object Identifier")
    publication_date: datetime = Field(..., description="Publication date")
    description: str = Field(..., description="Description of the resource")
    access_right: str = Field(..., description="Access rights of the resource")
    creators: list = Field(..., description="List of creators")
    keywords: list | None = None
    version: str = Field(..., description="Version of the resource")
    language: str | None = None
    mapped_language: dict | None = None
    language_override: str | None = "en"

    @model_validator(mode="after")
    def normalize_language(self):
        if not self.language:
            return self
        self.language_override = "en"
        code = self.language.strip().lower()
        lang = (pycountry.languages.get(alpha_2=code)
                or pycountry.languages.get(alpha_3=code)
                or pycountry.languages.get(terminology=code))

        if lang:
            alpha_2 = getattr(lang, "alpha_2", None)
            alpha_3 = getattr(lang, "alpha_3", None)
            name = lang.name

            self.mapped_language = {
                "alpha_2": alpha_2,
                "alpha_3": alpha_3,
                "name": name,
            }
            self.language_override = alpha_2

        return self

    references: list | None = None
    license: object = Field(..., description="License information")
    grants: list | None = None
    communities: list | None = None
    contributors: list | None = None
    subjects: list | None = None
    relations: object | None = None
    notes: str | None = None
    custom: object | None = None
    resource_type: object = Field(
        description="Type of the resource, e.g., Tool, Service, Dataset.")

    mapped_resource_type: dict | None = None

    @field_validator("communities", mode="before")
    def validate_communities(cls, v):
        """Validate that the resource is part of graspos community.
         ️   Communities is an array of objects with 'id' field and value that contains 'graspos'."""
        if v is None:
            return v
        for community in v:
            if isinstance(community, dict):
                community_id = community.get("id", "")
                if "graspos" in community_id.lower():
                    return v
        raise ValueError("Resource is not part of graspos community")

    @field_validator("resource_type")
    def validate_resource_type(cls, v):
        mapping = {
            "Tool": {
                "types": ["tool", "software"],
            },
            "Dataset": {
                "types": ["dataset"],
            },
            "Document": {
                "types": ["publication", "document"],
                "subtypes": [
                    "publication", "journal", "other", "document", "article",
                    "report"
                ],
            },
            "Service": {
                "types": ["service"],
            },
        }

        if v is None:
            return None

        if isinstance(v, str):
            normalized = v.strip().lower()
            for canonical, conf in mapping.items():
                if normalized in conf.get("types", []):
                    return {"type": canonical}
            valid_values = ", ".join(
                sorted({
                    t
                    for conf in mapping.values()
                    for t in conf.get("types", [])
                }))
            raise ValueError(
                f"Resource type '{v}' not recognized (valid: {valid_values})")

        if isinstance(v, dict):
            type_value = v.get("type", "").strip().lower()
            subtype_value = v.get(
                "subtype", "").strip().lower() if v.get("subtype") else None

            for canonical, conf in mapping.items():
                if type_value in conf.get("types", []):
                    if subtype_value:
                        if "subtypes" in conf:
                            if subtype_value in [
                                    s.lower() for s in conf["subtypes"]
                            ]:
                                return {
                                    "type": canonical,
                                    "subtype": subtype_value
                                }
                            else:
                                valid_subtypes = ", ".join(conf["subtypes"])
                                raise ValueError(
                                    f"Invalid subtype '{subtype_value}' for '{canonical}'. "
                                    f"Valid subtypes: {valid_subtypes}")
                    return {"type": canonical}

            valid_types = ", ".join(
                sorted({
                    t
                    for conf in mapping.values()
                    for t in conf.get("types", [])
                }))
            raise ValueError(
                f"Resource type '{type_value}' not recognized (valid: {valid_types})"
            )

        raise ValueError(
            "Resource type must be a string or object with a 'type' field")

    @model_validator(mode="after")
    def set_mapped_resource_type(self):

        label_mapping = {
            "Document": "Templates & Guidelines",
            "Tool": "Tool",
            "Dataset": "Dataset",
            "Service": "Service",
        }

        if self.resource_type and isinstance(self.resource_type, dict):
            type_value = self.resource_type.get("type")
            if type_value:
                label_value = label_mapping.get(type_value, type_value)
                self.mapped_resource_type = {
                    "value": type_value.lower(),
                    "label": label_value,
                }

        return self


class Zenodo(BaseModel):
    source: str | None = None
    resource_url_name: str | None = None
    created: datetime | None = None
    modified: datetime | None = None
    zenodo_id: int | None = None
    conceptrecid: str | None = None
    doi: str | None = None
    conceptdoi: str | None = None
    doi_url: str | None = None
    metadata: ZenodoMetadata | None = None
    title: str | None = None
    links: object | None = None
    updated: datetime | None = None
    recid: str | None = None
    revision: int | None = None
    files: list | None = None
    swh: object | None = None
    owners: list | None = None
    status: str | None = None
    stats: object | None = None
    state: str | None = None
    submitted: bool | None = None
    indicators: dict | None = None
    created_at: datetime | None = datetime.now()
    modified_at: datetime | None = datetime.now()

    mapped_resource_type: dict | None = None

    @model_validator(mode="after")
    def propagate_mapped_resource_type(self):

        if self.metadata and self.metadata.mapped_resource_type:
            self.mapped_resource_type = self.metadata.mapped_resource_type
        return self


class ZenodoView(BaseModel):
    source: str | None = None


class ZenodoUpdate(BaseModel):
    id: PydanticObjectId | None = None


class Zenodo(Document, Zenodo, ZenodoView):

    class Settings:
        name = "zenodo"
        indexes = [
            IndexModel(
                [("metadata.title", pymongo.TEXT),
                 ("metadata.description", pymongo.TEXT)
                 ],  # Compound text index
                name="metadata_title_description_text",
                weights={
                    "metadata.title": 1,
                    "metadata.description": 1
                },  # Optional: You can add custom weights
                default_language="english",
                language_override="language_override",
                textIndexVersion=3),
        ]

    class Config:
        json_schema_extra = {
            "example": {
                "title": "example-name",
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
    async def get_unique_licenses(cls) -> list[dict]:
        """Return all unique license dicts from the metadata."""
        documents = await cls.find_all().to_list()
        licenses = {
            frozenset(doc.metadata.license.items())
            for doc in documents
            if doc.metadata and isinstance(doc.metadata.license, dict)
        }
        return [dict(license) for license in licenses]
