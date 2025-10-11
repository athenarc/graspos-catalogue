"""Authentication router."""

from fastapi import APIRouter, HTTPException, Security, status
from fastapi_jwt import JwtAuthorizationCredentials

from models.auth import AccessToken, RefreshToken
from models.user import User, UserAuth
from jwt import access_security, refresh_security
from util.password import hash_password

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])


@router.post("/login", response_model=RefreshToken)
async def login(user_auth: UserAuth):
    """Authenticate and returns the user's JWT."""

    user = await User.by_username(user_auth.username)
    if user is None or hash_password(user_auth.password) != user.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect username or password")
    if user.email_confirmed_at is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Email is not yet verified")
    if user.disabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="User account is disabled")
    access_token = access_security.create_access_token(user.jwt_subject)
    refresh_token = refresh_security.create_refresh_token(user.jwt_subject)
    return RefreshToken(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh")
async def refresh(auth: JwtAuthorizationCredentials = Security(
    refresh_security)) -> AccessToken:
    """Return a new access token from a refresh token."""
    access_token = access_security.create_access_token(subject=auth.subject)
    return AccessToken(access_token=access_token)
