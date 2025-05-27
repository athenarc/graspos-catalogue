from beanie import Document
from pydantic import Field
from pydantic import BaseModel


class GeographicalCoverage(Document):
    code: str = Field(..., description="ISO 3166-1 alpha-2 country code")
    label: str
    flag: str
    lat: float | None = None
    lng: float | None = None

    class Settings:
        name = "geographical_coverages"


class GeoCoverageWithCount(BaseModel):
    id: str
    code: str = Field(..., description="ISO 3166-1 alpha-2 country code")
    label: str
    flag: str
    lat: float | None = None
    lng: float | None = None
    resource_count: int
