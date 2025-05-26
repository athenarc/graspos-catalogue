from beanie import Document
from pydantic import Field

class GeographicalCoverage(Document):
    code: str = Field(..., description="ISO 3166-1 alpha-2 country code")
    label: str
    flag: str

    class Settings:
        name = "geographical_coverage"