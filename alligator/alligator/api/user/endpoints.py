from fastapi import APIRouter, Depends

from alligator.core import user_crud
from alligator.api.user import contract
from alligator.core import repository
from alligator.service import anketa

router = APIRouter()


@router.get("/user_api/get_user", response_model=contract.User)
async def get_users_me(
    current_user: contract.User = Depends(user_crud.get_current_user),
):
    current_user = dict(current_user)
    respond = contract.User(
        name=current_user["name"],
        lastName=current_user["last_name"],
        email=current_user["email"],
        phone=current_user["phone"],
        anketaPassed=current_user["anketa_passed"],
    )
    return respond


@router.post("/user_api/patch_saved")
async def patch_saved(
    req: contract.PostUserActionRequestModel,
    current_user: contract.User = Depends(user_crud.get_current_user),
):
    await user_crud.save_action(
        current_user, req.id, repository.Action.SAVE, req.append, None
    )


@router.post("/user_api/patch_visited")
async def patch_visited(
    req: contract.PostUserActionRequestModel,
    current_user: contract.User = Depends(user_crud.get_current_user),
):
    await user_crud.save_action(
        current_user, req.id, repository.Action.VISIT, req.append, None
    )


@router.post("/user_api/patch_rate")
async def patch_rated(
    req: contract.PostUserRateRequestModel,
    current_user: contract.User = Depends(user_crud.get_current_user),
):
    await user_crud.save_action(
        current_user, req.id, repository.Action.RATE, True, req.rate
    )


@router.post("/user_api/get_actions")
async def get_actions():
    resp = list(await user_crud.get_actions())
    for element in resp:
        element["_id"] = str(element["_id"])
        element["user_id"] = str(element["user_id"])
        element["event_id"] = str(element["event_id"])
    return resp


@router.get("/user_api/get_anketa")
async def get_anketa():
    return anketa.anketa


@router.post("/user_api/anketa_post")
async def post_anketa(
    req: contract.AnketaList,
    current_user: contract.User = Depends(user_crud.get_current_user),
):
    priority_list = []
    for priority in list(req.anketa_priority):
        priority_list.append(priority.priority)
    user_id = str(current_user["_id"])
    await user_crud.save_anketa_result(user_id, priority_list)
