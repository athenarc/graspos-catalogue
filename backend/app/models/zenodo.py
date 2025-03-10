"""Zenodo models."""

from beanie import Document
from datetime import datetime
from pydantic import BaseModel
from datetime import datetime
import requests


class ZenodoMetadata(BaseModel):
    title: str | None = None  #	"BIP! DB: A Dataset of Impact Measures for Research Products"
    doi: str | None = None  #	"10.5281/zenodo.14444109"
    publication_date: datetime | None = None  #	"2024-12-13"
    description: str | None = None  #`<p>This dataset contains…e the above article.</p>`
    access_right: str | None = None  #	"open"
    creators: list | None = None  #	[…]
    keywords: list | None = None  #	[…]
    version: str | None = None  #	"17"
    references: list | None = None  #	[…]
    resource_type: object | None = None  #	{…}
    license: object | None = None  #	{…}
    grants: list | None = None  #	[…]
    communities: list | None = None  #	[…]
    relations: object | None = None  #	{…}
    notes: str | None = None  #	"Please cite: Thanasis Ve…n Volume) 2021: 456-460"


class Zenodo(BaseModel):

    source: str
    created: datetime | None = None,  #"2024-12-14T07:58:16.324225+00:00",
    modified: datetime | None = None,  #"2024-12-14T07:58:16.696455+00:00",
    zenodo_id: int | None = None,  #14444109,
    conceptrecid: str | None = None,  #"4386934",
    doi: str | None = None,  #"10.5281/zenodo.14444109",
    conceptdoi: str | None = None,  #"10.5281/zenodo.4386934",
    doi_url: str | None = None,  #"https://doi.org/10.5281/zenodo.14444109",
    metadata: ZenodoMetadata | None = None,  #{…},
    title: str | None = None,  #"BIP! DB: A Dataset of Im…s for Research Products",
    links: object | None = None,  #{…},
    updated: datetime | None = None,  #"2024-12-14T07:58:16.696455+00:00",
    recid: str | None = None,  #"14444109",
    revision: int | None = None,  #4,
    files: list | None = None,  #[…],
    swh: object | None = None,  #{},
    owners: list | None = None,  #[…],
    status: str | None = None,  #"published",
    stats: object | None = None,  #{…},
    state: str | None = None,  #"done",
    submitted: bool | None = None  #true,


class Zenodo(Document, Zenodo):

    class Settings:
        name = "zenodo"

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
    def get_data(cls, source):
        if "https://zenodo.org/records/" in source:
            source = source.replace("/records/", "/api/records/")
        x = None
        try:
            x = requests.get(source)
        except requests.exceptions.RequestException as e:
            return {"status": 404, "detail": "Not a valid Zenodo url."}

        if x and x.json():
            resource = x.json()
            resource["zenodo_id"] = resource["id"]
            del resource["id"]
            return resource
