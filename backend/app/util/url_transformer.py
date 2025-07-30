
from urllib.parse import urlparse
from fastapi import HTTPException
import re

def transform_url(original_url: str) -> str:
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
