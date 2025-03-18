import requests, ast


def get_zenodo_data(source):

    if "https://zenodo.org/records/" in source:
        source = source.replace("/records/", "/api/records/") + ("/versions/latest")
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
