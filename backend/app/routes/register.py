"""Registration router."""

from fastapi import APIRouter, Body, HTTPException, Response, Depends, status
from pydantic import EmailStr

from models.user import User, UserAuthRegister, UserOut
from jwt import access_security, user_from_token
from jwt_pass import create_reset_token, create_register_token, verify_reset_token
from util.mail import send_password_reset_email, send_verification_email
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
                email_confirmed_at=None,
                username=user_auth.username,
                first_name=user_auth.first_name,
                last_name=user_auth.last_name,
                organization=user_auth.organization,
                orcid=user_auth.orcid)

    try:
        await user.create()
    except Exception as e:
        raise HTTPException(500, {"error": str(e)})
    token = create_register_token(user_auth)
    print(token)
    try:
        await send_verification_email(user_auth.email, token)
    except Exception as e:
        raise HTTPException(500, {"error": str(e)})

    return user


@router.post("/forgot-password")
async def forgot_password(email: EmailStr = Body(embed=True)) -> dict:
    """Send password reset email (secure & silent)."""
    user = await User.by_email(email)
    if user and not user.disabled:
        token = create_reset_token(user)
        await send_password_reset_email(email, token)
    return {
        "detail": "If an account exists, a password reset link has been sent."
    }


@router.post("/reset-password", response_model=UserOut)
async def reset_password(
        password: str = Body(..., embed=True),
        email: str = Body(..., embed=True),
        token: str = Body(..., embed=True),
):
    """Reset password from valid token (stateless)."""
    verified_user = await verify_reset_token(token, scope="password_reset")

    if not verified_user:
        raise HTTPException(status_code=400,
                            detail="Invalid or expired token.")

    if verified_user.email != email:
        raise HTTPException(status_code=401,
                            detail="Unauthorized password reset attempt.")

    user = await User.by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if user.disabled:
        raise HTTPException(status_code=403,
                            detail="This account is disabled.")
    if not user.email_confirmed_at:
        raise HTTPException(status_code=400, detail="Email not verified.")

    user.password = hash_password(password)
    await user.save()
    return user


@router.get("/verify/{token}", response_model=UserOut)
async def verify_email(token: str) -> UserOut:
    """Verify user email from token value (existing logic)."""
    verified_user = await verify_reset_token(token, scope="email_confirm")
    if verified_user is None:
        raise HTTPException(404, "No user found for that token")
    if verified_user.email_confirmed_at is not None:
        raise HTTPException(400, "Email is already verified")
    if verified_user.disabled:
        raise HTTPException(400, "Your account is disabled")

    verified_user.email_confirmed_at = datetime.now()
    await verified_user.save()
    return verified_user
