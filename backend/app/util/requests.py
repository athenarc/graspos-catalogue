import requests, ast


def get_zenodo_data(source):

    if "https://zenodo.org/records/" in source:
        source = source.replace("/records/", "/api/records/")
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
            resource = request.json()
            resource["zenodo_id"] = resource["id"]
            resource["source"] = source
            del resource["id"]

            return {"status": 200, "zenodo_object": resource}
    else:
        error = ast.literal_eval(request.text)
        return {
            "status": error["status"],
            "detail": error["message"],
            "zenodo_object": {}
        }
