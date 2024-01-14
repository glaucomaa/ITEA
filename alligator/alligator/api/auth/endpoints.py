from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import EmailStr

from alligator.api.auth import contract
from alligator.core import user_crud
from alligator.models import user
from alligator.core import repository

router = APIRouter()


@router.post("/auth_api/registration", response_model=contract.Token)
async def create_new_user(user_registration: user.UserRegistration):
    if repository.get_user(user_registration.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с такой почтой уже зарегистрирован!",
            headers={"WWW-Authenticate": "Bearer"},
        )
    hashed_password = user_crud.get_password_hash(user_registration.password)
    user_inwork = user.UserInDb(
        name=user_registration.name,
        lastName=user_registration.last_name,
        email=user_registration.email,
        hashed_password=hashed_password,
        phone=user_registration.phone,
        anketa_passed=False,
    )
    repository.add_user(user_inwork.dict())
    access_token = user_crud.create_access_token(data={"sub": user_inwork.email})
    respond = contract.Token(accessToken=access_token, tokenType="bearer")
    return respond


@router.post("/auth_api/login", response_model=contract.Token)
@router.post("/token", response_model=contract.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user_inwork = user_crud.authenticate_user(
        EmailStr(form_data.username), form_data.password
    )
    if not user_inwork:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect login or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = user_crud.create_access_token(data={"sub": user_inwork["email"]})
    response = contract.Token(accessToken=access_token, tokenType="Bearer")
    return response
