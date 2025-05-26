from pydantic import BaseModel

class GeographicalCoverage(BaseModel):
    code: str
    label: str
    flag: str