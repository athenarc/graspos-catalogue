import requests, ast, re

def get_zenodo_data(source):

    if "https://zenodo.org/records/" in source:
        source = source.replace("/records/", "/api/records/")
        
    if "/versions/latest" not in source:
        source += "/versions/latest"
        
    request = None
    try:
        request = requests.get(source)
    except requests.exceptions.RequestException as e:
        return {
            "status": 404,
            "detail": "Not a valid Zenodo url.",
            "zenodo_object": {}
        }

    if request.status_code == 200:

        if request and request.json():
            CLEANR = re.compile('<.*?>|&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});')
            resource = request.json()
            resource["zenodo_id"] = resource["id"]
            resource["source"] = source
            if "metadata" in resource:
                if "description" in resource["metadata"]:
                    resource["metadata"]["description"] = re.sub(CLEANR, '', resource["metadata"]["description"])
            del resource["id"]

            return {"status": 200, "zenodo_object": resource}
    else:
        if str(request.status_code).startswith('5'):
            return {
                "status": request.status_code,
                "detail": "Zenodo server error. Please try again later",
                "zenodo_object": {}
            }
        error = ast.literal_eval(request.text)
        return {
            "status": error["status"],
            "detail": error["message"],
            "zenodo_object": {}
        }

