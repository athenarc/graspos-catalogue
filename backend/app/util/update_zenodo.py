from fastapi import HTTPException
from models.zenodo import Zenodo
from models.update import Update
from .requests import get_zenodo_data

async def update_records(user_id=None, zenodo_id=None):
    records = []

    if zenodo_id:
        record = await Zenodo.get(zenodo_id)
        if record:
            records.append(record)
    else:
        records = await Zenodo.find().to_list()

    if len(records) == 0:
        raise HTTPException(status_code=404, detail="No resources found!")

    zenodo_updates = []
    errors = []

    for record in records:
        try:
            data = await get_zenodo_data(record.source)
            if data["status"] != 200:
                errors.append({
                    "record_id": str(record.id),
                    "source": record.source,
                    "status": data["status"],
                    "detail": data["detail"],
                })
                continue  # If a record fails to fetch, skip to the next one

            new_zenodo = data["zenodo_object"]

            if new_zenodo["zenodo_id"] != record.zenodo_id:
                zenodo_record = await Zenodo.get(record.id)
                if not zenodo_record:
                    errors.append({
                        "record_id": str(record.id),
                        "source": record.source,
                        "status": 404,
                        "detail": "Zenodo record does not exist"
                    })
                    continue

                updated_model = Zenodo(**new_zenodo)
                fields = updated_model.model_dump(exclude_unset=True)
                updated_record = Zenodo.model_copy(zenodo_record, update=fields)
                await updated_record.save()

                zenodo_updates.append({
                    "zenodo": updated_record,
                    "old_version": record.zenodo_id,
                    "new_version": updated_record.zenodo_id
                })

        except Exception as e:
            errors.append({
                "record_id": str(record.id),
                "source": record.source,
                "status": 500,
                "detail": str(e),
            })

    if zenodo_updates:
        update = Update(updates=zenodo_updates, user_id=user_id)
        await update.save()


    if errors:
        # Create a detailed message for the HTTPException
        # Collect updated IDs and error sources for the message
        updated_ids = [str(update["zenodo"].zenodo_id) for update in zenodo_updates]
        error_sources = [err["source"] for err in errors]

        detail_message = (
            f"Updated {len(zenodo_updates)} Zenodo record(s): {', '.join(updated_ids) if updated_ids else 'None'}.\n"
            f"Failed to update {len(errors)} record(s) from sources: {', '.join(error_sources)}.\n"
            "See errors for details."
        )

        # Return also the errors in the HTTPException
        raise HTTPException(
            status_code=422,
            detail={
                "message": detail_message,
                "errors": errors,
                "updated_count": len(zenodo_updates)
            }
        )

    detail = (
        f"Zenodo record {zenodo_id} updated successfully"
        if zenodo_id else
        "Zenodo records updated successfully"
    )

    return {
        "status": 200,
        "detail": detail,
        "records_updated": len(zenodo_updates)
    }
