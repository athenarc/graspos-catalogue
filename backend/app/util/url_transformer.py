from urllib.parse import urlparse
from fastapi import HTTPException
import re


def transform_openaire_url(original_url: str) -> str:
    """
    Transforms a URL of the form /service/<resource>/overview
    to /api/catalogue-resources/<resource>
    Used for the OpenAIRE service.
    """
    parsed = urlparse(original_url)

    # Regex to match the resource
    match = re.match(r"^/service/([a-zA-Z0-9_.-]+)/overview$", parsed.path)
    if match:
        resource = match.group(1)
        return f"{parsed.scheme}://{parsed.netloc}/api/catalogue-resources/{resource}"

    raise HTTPException(status_code=400, detail="Unsupported URL format")


import unicodedata


def transform_zenodo_url(source: str) -> str | None:
    """
    Extract Zenodo record ID from a DOI or Zenodo URL and return the API URL.
    Examples:
      10.5281/zenodo.10564109 -> https://zenodo.org/api/records/10564109/versions/latest
      https://zenodo.org/records/10564110 -> https://zenodo.org/api/records/10564110/versions/latest
    """
    if not source:
        return None

    source = unicodedata.normalize("NFKC", source).strip()

    # Match patterns like:
    # - 10.5281/zenodo.10564109
    # - https://zenodo.org/record/10564109
    # - https://zenodo.org/records/10564109
    match = re.search(r'(?:zenodo\.org/(?:record|records)/|zenodo\.)(\d+)',
                      source)

    if not match:
        return None

    record_id = match.group(1)
    return f"https://zenodo.org/api/records/{record_id}/versions/latest"
