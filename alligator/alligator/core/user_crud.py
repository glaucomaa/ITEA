from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import EmailStr

from alligator.models import settings
from alligator.core import repository
from alligator.models.token import TokenData
from alligator.core.anketa_dict import get_interest_dict
from alligator.service.recs.rec import scalar
from alligator.service.recs.n_dim_operations import visit, visit_inv, saved, saved_inv

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

my_settings = settings.Settings()


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str):
    return pwd_context.hash(password)


def authenticate_user(email: EmailStr, password: str):
    user_inwork = repository.get_user(email)
    if not user_inwork:
        return False
    if not verify_password(password, user_inwork.get("hashed_password")):
        return False
    return user_inwork


def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(
        to_encode, my_settings.secret_key, algorithm=my_settings.algorithm
    )
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"www-authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, my_settings.secret_key, algorithms=my_settings.algorithm
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = repository.get_user(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user


async def save_action(
    user, event_id: str, action_kind: repository.Action, save: bool, grade: int | None
):
    user_id = str(user.get("_id"))
    desc_vec = repository.get_event_by_id(event_id)["description_vec"]
    cluster = str(repository.get_event_by_id(event_id)["cluster"])
    int_vec = repository.get_user_rec_data(user_id)["interests_vec"]
    if save:
        repository.add_action(user_id, event_id, action_kind, grade)
        if action_kind == repository.Action.SAVE:
            int_vec[cluster] = list(saved(int_vec[cluster], desc_vec))
            repository.update_rec_vector(user_id, int_vec)
        elif action_kind == repository.Action.VISIT:
            int_vec[cluster] = list(visit(int_vec[cluster], desc_vec))
            repository.update_rec_vector(user_id, int_vec)
    else:
        repository.delete_action(user_id, event_id, action_kind, grade)
        if action_kind == repository.Action.SAVE:
            int_vec[cluster] = list(saved_inv(int_vec[cluster], desc_vec))
            repository.update_rec_vector(user_id, int_vec)
        elif action_kind == repository.Action.VISIT:
            int_vec[cluster] = list(visit_inv(int_vec[cluster], desc_vec))
            repository.update_rec_vector(user_id, int_vec)


async def save_anketa_result(user_id: str, anketa_result: list):
    interests = get_interest_dict(anketa_result)
    repository.save_anketa_result(user_id, interests)
    repository.change_anketa_status(user_id)
    await build_recommendations(user_id)


async def build_recommendations(user_id: str):
    user_rec = repository.get_user_rec_data(user_id)
    events_count = repository.get_actual_events_total_count()
    _, events = await repository.get_events(actual=True, skip=0, per_page=events_count)
    events = list(events)
    rec_vec = {}
    for event in events:
        rec_vec[event["_id"]] = scalar(
            user_rec["interests_vec"][str(event["cluster"])], event["description_vec"]
        )
    rec_vec = [k[0] for k in reversed(sorted(rec_vec.items(), key=lambda f: f[1]))]
    repository.save_user_rec(user_id, rec_vec)


async def get_actions():
    return repository.get_actions()
