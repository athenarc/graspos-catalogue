import httpx, re
from util.url_transformer import transform_zenodo_url, transform_openaire_url
from models.trl import TRLEntry


async def get_openaire_data(source: str) -> dict:
    """
    Async function to fetch OpenAIRE metadata by record URL or DOI.
    """
    try:
        async with httpx.AsyncClient() as client:
            transformed_url = transform_openaire_url(source)
            response = await client.get(transformed_url)
            if response.status_code == 200:
                data = response.json()

                data["openaireId"] = data.get("id")
                data["source"] = source.strip()
                data["metadata"] = data
                data["metadata"]["communities"] = [{
                    "id": "graspos-services"
                }] if "graspos" in source.lower() else []
                trl_entry = None
                if "trl" in data["metadata"]:

                    trl_id_val = None

                    if isinstance(data["metadata"]["trl"], str):
                        trl_id_val = int(
                            re.sub(r'\D', '', data["metadata"]["trl"]).strip())
                    elif isinstance(data["metadata"]["trl"], int):
                        trl_id_val = data["metadata"]["trl"]

                    if trl_id_val:
                        trl_entry = await TRLEntry.find_one(
                            TRLEntry.trl_id == trl_id_val)

                        data["metadata"][
                            "trl"] = trl_entry.id if trl_entry else None
                    else:
                        data["metadata"]["trl"] = None
                else:

                    data["metadata"]["trl"] = None

                del data["id"]

                return {"status": 200, "openaire_object": data}
            else:
                return {
                    "status": response.status_code,
                    "detail": "Failed to fetch OpenAIRE data.",
                    "openaire_object": {}
                }
    except httpx.RequestError as e:
        return {
            "status": 503,
            "detail": f"Request failed: {str(e)}",
            "openaire_object": {}
        }
    re


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
        async with httpx.AsyncClient(follow_redirects=True,
                                     timeout=10.0) as client:
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
                error = {
                    "status": response.status_code,
                    "message": "Unknown error from Zenodo."
                }

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
