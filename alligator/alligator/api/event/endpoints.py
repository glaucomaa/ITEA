from fastapi import APIRouter, Depends, Response, Request

from alligator.api.event import contract
from alligator.core import event_crud, user_crud
from alligator.api.user.contract import User

router = APIRouter()


@router.get(
    "/events_api/get_actual", response_model=list[contract.GetAllEventsEventResponse]
)
async def get_actual_events(
    request: Request,
    response: Response,
    _page: int = 1,
    _limit: int = 10,
    _search: str = None,
):
    try:
        token = request.headers["authorization"].split()[1]
        user_id = str((await user_crud.get_current_user(token))["_id"])
        saved_events = event_crud.get_events_ids(user_id, 0)
    except:
        saved_events = []
    total_count, events = await event_crud.get_events(True, _page, _limit, _search)
    resp = to_list(events, saved_events)
    response.headers["x-total-count"] = str(total_count)
    return resp


@router.get(
    "/events_api/get_saved", response_model=list[contract.GetAllEventsEventResponse]
)
async def get_saved_events(
    response: Response,
    _page: int = 1,
    _limit: int = 10,
    _search: str = None,
    current_user: User = Depends(user_crud.get_current_user),
):
    total_count, events = await event_crud.get_saved_events(
        user=current_user, page=_page, limit=_limit, search=_search
    )
    resp = to_list(events)
    response.headers["x-total-count"] = str(total_count)
    return resp


@router.get(
    "/events_api/get_recomended",
    response_model=list[contract.GetAllEventsEventResponse],
)
async def get_recommended_events(
    response: Response,
    _page: int = 1,
    _limit: int = 10,
    _search: str = None,
    current_user: User = Depends(user_crud.get_current_user),
):
    total_count, events = await event_crud.get_recommended_events(
        user=current_user, page=_page, limit=_limit, search=_search
    )
    response.headers["x-total-count"] = str(total_count)
    return events


@router.get(
    "/events_api/get_past", response_model=list[contract.GetPastEventsEventResponse]
)
async def get_past_events(
    request: Request,
    response: Response,
    _page: int = 1,
    _limit: int = 10,
    _search: str = None,
):
    total_count, events = await event_crud.get_events(False, _page, _limit, _search)
    resp = list()
    try:
        token = request.headers["authorization"].split()[1]
        user_id = str((await user_crud.get_current_user(token))["_id"])
        visited_events = event_crud.get_events_ids(user_id, 1)
    except:
        user_id = None
        visited_events = []
    for event in events:
        date = event["full_date_time"].split()[0]
        visited = True if visited_events.count(str(event["_id"])) > 0 else False
        rate = event_crud.get_rate_action(user_id, str(event["_id"])) if user_id else 0
        resp.append(
            contract.GetPastEventsEventResponse(
                id=str(event["_id"]),
                title=event["title"],
                date=date,
                image=event["image_url"],
                form="онлайн"
                if (
                    event["full_place"].lower().find("онлайн") != -1
                    or event["full_place"].lower().find("online") != -1
                )
                else "оффлайн",
                visited=visited,
                rate=rate,
            )
        )
    response.headers["x-total-count"] = str(total_count)
    return resp


@router.get("/events_api/get_event/{id}", response_model=contract.GetEventByIdResponse)
async def get_event_by_id(id: str):
    event = event_crud.get_event_by_id(id)
    orgs = ", ".join(event["organizers"]) if event["organizers"] else None
    resp = contract.GetEventByIdResponse(
        id=str(event["_id"]),
        title=event["title"],
        date=event["full_date_time"],
        image=event["image_url"],
        form="онлайн"
        if (
            event["full_place"].lower().find("онлайн") != -1
            or event["full_place"].lower().find("online") != -1
        )
        else "оффлайн",
        info=event["description"],
        location=event["full_place"],
        org=orgs,
        source=event["site"],
    )
    return resp


def to_list(events, saved_events: list | None = None):
    resp = list()
    for event in events:
        date = event["date_time"].strftime("%d.%m.%Y")
        if saved_events is not None:
            saved = True if saved_events.count(str(event["_id"])) > 0 else False
        else:
            saved = True
        resp.append(
            contract.GetAllEventsEventResponse(
                id=str(event["_id"]),
                title=event["title"],
                date=date,
                image=event["image_url"],
                form="онлайн"
                if (
                    event["full_place"].lower().find("онлайн") != -1
                    or event["full_place"].lower().find("online") != -1
                )
                else "оффлайн",
                save=saved,
            )
        )
    return resp
