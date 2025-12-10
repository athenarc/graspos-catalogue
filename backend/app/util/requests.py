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
                data["api_url"] = transformed_url
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

            indicators = await get_openaire_citation_data(
                doi=resource["conceptdoi"] if "conceptdoi" in resource else "")

            if indicators["status"] == 200:
                resource["indicators"] = indicators["openaire_citation"]

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


import httpx
from typing import Any, Dict, Optional


async def get_openaire_citation_data(doi: str) -> Dict[str, Any]:
    """
    Fetch citation indicators from the OpenAIRE API for a given DOI.

    Args:
        doi (str): The DOI identifier.

    Returns:
        dict: {
            "status": int,
            "openaire_citation": dict,
            "detail": Optional[str]
        }
    """
    if not doi:
        return {
            "status": 400,
            "openaire_citation": {},
            "detail": "Missing DOI"
        }

    url = f"https://api.openaire.eu/graph/v2/researchProducts?pid={doi}"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            res = await client.get(url)

        if res.status_code != 200:
            return {
                "status": res.status_code,
                "openaire_citation": {},
                "detail": f"OpenAIRE returned status {res.status_code}"
            }

        data = res.json()

        results = data.get("results", [])

        if not results:
            return {
                "status": 200,
                "openaire_citation": {},
                "detail": "No results found"
            }

        indicators = results[0].get("indicators", {})
        return {"status": 200, "openaire_citation": indicators, "detail": None}

    except httpx.RequestError as e:
        return {
            "status": 503,
            "openaire_citation": {},
            "detail": f"Request failed: {str(e)}"
        }
    except Exception as e:
        return {
            "status": 500,
            "openaire_citation": {},
            "detail": f"Unexpected error: {str(e)}"
        }
