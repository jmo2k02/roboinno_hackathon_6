import logging
from typing import Annotated
from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm

from src.api_core.deps import DbSession, GetUserManager, GetAuthenticationClient, CurrentUserAndToken
from src.users.schema import UserOutput, UserCreate
from .schemas import Token
from .service import AuthService

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/register", status_code=201, response_model=UserOutput)
async def register_user(data: UserCreate,
                        user_manager: GetUserManager,
                        session: DbSession):
    raise NotImplementedError()


@router.post("/login/access-token", status_code=200, response_model=Token)
async def login_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                             kc_openid_auth_client: GetAuthenticationClient,
                             session: DbSession,
                             request: Request) -> Token:
    raise NotImplementedError()


@router.get("/me", status_code=200, response_model=UserOutput)
async def get_current_user(current_user_and_token: CurrentUserAndToken,
                           session: DbSession
                           ) -> UserOutput:
    raise NotImplementedError()