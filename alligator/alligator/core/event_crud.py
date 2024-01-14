import datetime

from alligator.core import repository
from alligator.core import user_crud


async def get_events(actual: bool, page: int, limit: int, search: str):
    skip = (page - 1) * limit
    total_count, resp = await repository.get_events(
        actual=actual, skip=skip, per_page=limit, search=search
    )
    return total_count, list(resp)


async def get_saved_events(user, page: int, limit: int, search: str):
    user_id = repository.get_user(user["email"])["_id"]
    skip = (page - 1) * limit
    events_ids = repository.get_events_ids(user_id, repository.Action.SAVE)
    total_count, events = repository.get_events_by_ids(events_ids, skip, limit, search)
    return total_count, events


async def get_recommended_events(user, page: int, limit: int, search: str):
    user_id = repository.get_user(user["email"])["_id"]
    saved_events = repository.get_events_ids(str(user_id), repository.Action.SAVE)
    skip = (page - 1) * limit
    rec_data = repository.get_user_rec_data(user_id)
    last_update: datetime.datetime = rec_data["updated_at"]
    if (datetime.datetime.now() - last_update).total_seconds() > 28800:
        await user_crud.build_recommendations(user_id)
        rec_data = repository.get_user_rec_data(user_id)
    events = rec_data["rating"]
    total_count = len(events)
    resp = []
    for event_id in events[skip : skip + limit]:
        event = repository.get_event_by_id(event_id)
        date = event["date_time"].strftime("%d.%m.%Y")
        if saved_events is not None:
            saved = True if saved_events.count(str(event["_id"])) > 0 else False
        else:
            saved = True
        resp.append(
            {
                "id": str(event["_id"]),
                "title": event["title"],
                "date": date,
                "image": event["image_url"],
                "form": "онлайн"
                if (
                    event["full_place"].lower().find("онлайн") != -1
                    or event["full_place"].lower().find("online") != -1
                )
                else "оффлайн",
                "save": saved,
            }
        )
    return total_count, resp


def get_event_by_id(id: str):
    return repository.get_event_by_id(id)


def get_events_ids(user_id, kind: int):
    return repository.get_events_ids(user_id, repository.Action(kind))


def get_rate_action(user_id: str, event_id: str):
    resp = repository.get_rate_action(user_id, event_id)
    if resp:
        resp = resp.get("grade")
    else:
        resp = 0
    return resp
