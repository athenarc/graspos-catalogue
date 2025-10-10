"""Registration router."""

from fastapi import APIRouter, Body, HTTPException, Response, Depends
from pydantic import EmailStr

from models.user import User, UserAuthRegister, UserOut
from jwt import access_security, user_from_token
from util.mail import send_password_reset_email
from util.password import hash_password
from datetime import datetime
from util.current_user import current_user
from util.verify_captcha import verify_recaptcha

router = APIRouter(prefix="/api/v1/register", tags=["Register"])

embed = Body(..., embed=True)


@router.post("", response_model=UserOut)
async def user_registration(user_auth: UserAuthRegister):
    """Create a new user."""
    await verify_recaptcha(user_auth.captcha_token)
    user = await User.by_email(user_auth.email)
    if user is not None:
        raise HTTPException(409,
                            {"email": "User with that email already exists"})

    user = await User.by_username(user_auth.username)
    if user is not None:
        raise HTTPException(
            409, {"username": "User with that username already exists"})

    hashed = hash_password(user_auth.password)
    user = User(email=user_auth.email,
                password=hashed,
                email_confirmed_at=datetime.now(),
                username=user_auth.username,
                first_name=user_auth.first_name,
                last_name=user_auth.last_name,
                organization=user_auth.organization,
                orcid=user_auth.orcid)
    await user.create()
    return user


@router.post("/forgot-password")
async def forgot_password(email: EmailStr = embed) -> Response:
    """Send password reset email."""
    user = await User.by_email(email)
    if user is None:
        raise HTTPException(404, "No user found with that email")
    # if user.email_confirmed_at is not None:
    #     raise HTTPException(400, "Email is already verified")
    if user.disabled:
        raise HTTPException(400, "Your account is disabled")
    token = access_security.create_access_token(user.jwt_subject)
    await send_password_reset_email(email, token)
    return Response(status_code=200)


@router.post("/reset-password", response_model=UserOut)
async def reset_password(
    password: str = Body(embed=True),
    email: str = Body(embed=True),
    user: User = Depends(current_user)):  # type: ignore[no-untyped-def]
    """Reset user password from token value."""
    if user is None:
        raise HTTPException(404, "No user found with that email")
    if user.email_confirmed_at is None:
        raise HTTPException(400, "Email is not yet verified")
    if user.disabled:
        raise HTTPException(400, "Your account is disabled")
    if user.email != email:
        if not user.super_user:
            raise HTTPException(401, "Unauthorized action") 
        user = await User.by_email(email)
    user.password = hash_password(password)
    await user.save()
    return user
