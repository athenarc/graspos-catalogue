from fastapi import HTTPException
from models.zenodo import Zenodo
from models.openaire import OpenAIRE
from models.update import Update
from .requests import get_zenodo_data, get_openaire_data


async def update_openaire_records(
    user_id=None,
    openaire_id=None,
):

    records = []
    if openaire_id:
        record = await OpenAIRE.get(openaire_id)
        if record:
            records.append(record)
        else:
            raise HTTPException(status_code=404,
                                detail="OpenAIRE record not found")
    else:
        records = await OpenAIRE.find().to_list()

    if len(records) == 0:
        raise HTTPException(status_code=404, detail="No resources found!")
    openaire_updates = []

    for record in records:

        if not record.metadata.version:
            continue

        openaire_update = {
            "openaire": record,
            "old_version": str(record.metadata.version),
            "new_version": None,
            "status": "not updated",
            "detail": "No update performed"
        }
        try:
            data = await get_openaire_data(record.source)
            if data["status"] != 200:
                # If the data fetch fails, log the error and continue
                openaire_update["status"] = "Error"
                openaire_update["detail"] = data["detail"]
                continue  # If a record fails to fetch, skip to the next one

            new_openaire = data["openaire_object"]

            if new_openaire["metadata"][
                    "version"] != record.metadata.version or openaire_id:

                updated_model = OpenAIRE(**new_openaire)
                fields = updated_model.model_dump(exclude_unset=True)
                updated_record = OpenAIRE.model_copy(record, update=fields)
                await updated_record.save()

                openaire_update["openaire"] = updated_record
                openaire_update["new_version"] = str(
                    new_openaire["metadata"]["version"])
                openaire_update["status"] = "Updated"
                openaire_update["detail"] = "Record updated successfully"
            else:
                # If the record is unchanged, log that as well
                openaire_update["old_version"] = str(record.metadata.version)
                openaire_update["status"] = "Up to date"
                openaire_update["detail"] = "Record is unchanged"

        except Exception as e:
            # If an error occurs during the update, log it
            openaire_update["status"] = "error"
            openaire_update["detail"] = str(e)

        openaire_updates.append(openaire_update)

    if openaire_updates:
        update = Update(updates=openaire_updates,
                        source="OpenAIRE",
                        user_id=user_id)
        try:
            await update.save()
        except Exception as e:
            raise HTTPException(status_code=500,
                                detail="Error saving update record")

    detail = (f"OpenAIRE record updated successfully"
              if openaire_id else "OpenAIRE records updated successfully")

    return {
        "status": 200,
        "detail": detail,
        "records_updated": len(openaire_updates)
    }


async def update_zenodo_records(user_id=None, zenodo_id=None):
    records = []

    if zenodo_id:
        record = await Zenodo.get(zenodo_id)
        if record:
            records.append(record)
        else:
            raise HTTPException(status_code=404,
                                detail="Zenodo record not found")
    else:
        records = await Zenodo.find().to_list()

    if len(records) == 0:
        raise HTTPException(status_code=404, detail="No resources found!")

    zenodo_updates = []

    for record in records:

        if not record.zenodo_id:
            continue

        zenodo_update = {
            "zenodo": record,
            "old_version": str(record.zenodo_id),
            "new_version": None,
            "status": "not updated",
            "detail": "No update performed"
        }
        try:
            data = await get_zenodo_data(record.source)
            if data["status"] != 200:
                # If the data fetch fails, log the error and continue
                zenodo_update["status"] = "Error"
                zenodo_update["detail"] = data["detail"]
                continue  # If a record fails to fetch, skip to the next one

            new_zenodo = data["zenodo_object"]

            if new_zenodo["zenodo_id"] != record.zenodo_id or zenodo_id:

                updated_model = Zenodo(**new_zenodo)
                fields = updated_model.model_dump(exclude_unset=True)
                updated_record = Zenodo.model_copy(record, update=fields)
                await updated_record.save()

                zenodo_update["zenodo"] = updated_record
                zenodo_update["new_version"] = str(new_zenodo["zenodo_id"])
                zenodo_update["status"] = "Updated"
                zenodo_update["detail"] = "Record updated successfully"
            else:
                # If the record is unchanged, log that as well
                zenodo_update["old_version"] = str(record.zenodo_id)
                zenodo_update["status"] = "Up to date"
                zenodo_update["detail"] = "Record is unchanged"

        except Exception as e:
            # If an error occurs during the update, log it
            zenodo_update["status"] = "error"
            zenodo_update["detail"] = str(e)

        zenodo_updates.append(zenodo_update)

    if zenodo_updates:
        update = Update(updates=zenodo_updates,
                        source="Zenodo",
                        user_id=user_id)
        try:
            await update.save()
        except Exception as e:
            raise HTTPException(status_code=500,
                                detail="Error saving update record")

    detail = (f"Zenodo record updated successfully"
              if zenodo_id else "Zenodo records updated successfully")

    return {
        "status": 200,
        "detail": detail,
        "records_updated": len(zenodo_updates)
    }
