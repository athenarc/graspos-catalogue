import httpx
from util.url_transformer import transform_zenodo_url 

async def get_zenodo_data(source: str) -> dict:
    """
    Async function to fetch metadata from Zenodo by record URL or DOI.
    """

    api_url = transform_zenodo_url(source)
    if not api_url:
        return {
            "status": 400,
            "detail": "Could not extract Zenodo record ID from source.",
            "zenodo_object": {}
        }

    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
            response = await client.get(api_url)

        if response.status_code == 200:
            resource = response.json()
            resource["zenodo_id"] = resource["id"]
            resource["source"] = source.strip()
            del resource["id"]

            return {"status": 200, "zenodo_object": resource}

        elif str(response.status_code).startswith("5"):
            return {
                "status": response.status_code,
                "detail": "Zenodo server error. Please try again later.",
                "zenodo_object": {}
            }

        else:
            try:
                error = response.json()
            except Exception:
                error = {"status": response.status_code, "message": "Unknown error from Zenodo."}

            return {
                "status": error.get("status", response.status_code),
                "detail": error.get("message", "Unknown error from Zenodo."),
                "zenodo_object": {}
            }

    except httpx.RequestError as e:
        return {
            "status": 503,
            "detail": f"Request failed: {str(e)}",
            "zenodo_object": {}
        }

# async def get_openaire_data():