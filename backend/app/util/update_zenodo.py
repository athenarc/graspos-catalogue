from fastapi import HTTPException
from models.zenodo import Zenodo
from models.update import Update
from .requests import get_zenodo_data


async def update_records(user_id=None, zenodo_id=None):

    records = []
    if zenodo_id:
        records.append(await Zenodo.get(zenodo_id))
    else:
        records = await Zenodo.find().to_list()

    if len(records) == 0:
        raise HTTPException(status_code=404,
                                     detail="No resources found!")
   
    zenodo_updates = []
    for record in records:
        record.source += "/versions/latest" if not "/versions/latest" in record.source else ""
        data = get_zenodo_data(record.source)

        if data["status"] != 200:

            raise HTTPException(status_code=data["status"],
                                detail=data["detail"])

        if data["zenodo_object"]["zenodo_id"] != record.zenodo_id:

            zenodo_record = await Zenodo.get(record.id)

            if not zenodo_record:
                raise HTTPException(status_code=404,
                                     detail="Zenodo record does not exist")

            zenodo = Zenodo(**data["zenodo_object"])
            fields = zenodo.model_dump(exclude_unset=True)
            updated_record = Zenodo.model_copy(zenodo_record, update=fields)
            await updated_record.save()

            zenodo_updates.append({
                "zenodo":
                updated_record,
                "old_version":
                record.zenodo_id,
                "new_version":
                updated_record.zenodo_id
            })
    
    if len(zenodo_updates) > 0:
        update = Update(updates=zenodo_updates, user_id=user_id)
        await update.save()
    detail = "Zenodo records updated successfully" if not zenodo_id else "Zenodo record " + str(
        zenodo_id) + " updated successfully"

    return {"status": 200, "detail": detail, "records_updated": len(zenodo_updates)}
