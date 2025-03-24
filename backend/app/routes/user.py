"""User router."""

from fastapi import APIRouter, Body, Depends, HTTPException, Response, Security
from fastapi_jwt import JwtAuthorizationCredentials

from models.user import User, UserOut, UserPasswordUpdate
from jwt import access_security
from util.current_user import current_user
from beanie import PydanticObjectId
from util.password import hash_password

router = APIRouter(prefix="/api/v1/user", tags=["User"])


@router.get("", response_model=UserOut)
async def get_user(
        user: User = Depends(current_user)):  # type: ignore[no-untyped-def]
    """Return the current user."""
    return user


@router.get("/users", response_model=list[UserOut])
async def get_all_users(
        user: User = Depends(current_user)):  # type: ignore[no-untyped-def]
    """Return the current user."""
    users = await User.find_all().to_list()
    return users


@router.get("/{user_id}")
async def get_user(
    user_id: PydanticObjectId,
    user: User = Depends(current_user)):  # type: ignore[no-untyped-def]
    """Return the current user."""
    userOut = await User.by_id(user_id)
    if userOut is None:
        raise HTTPException(404, "User not found")
    return {"username": userOut.username}


@router.patch("", response_model=UserOut)
async def update_user(
    update: UserPasswordUpdate,
    user: User = Depends(current_user)):  # type: ignore[no-untyped-def]
    """Update allowed user fields."""
    fields = update.model_dump(exclude_unset=True)
    user = await User.get(fields["id"])
    user = User.model_copy(user, update=fields)
    if update.password:
        if hash_password(update.password) != user.password:
            user.password = hash_password(update.password)
    await user.save()
    return user


@router.delete("")
async def delete_user(auth: JwtAuthorizationCredentials = Security(
    access_security)) -> Response:
    """Delete current user."""
    await User.find_one(User.email == auth.subject["username"]).delete()
    return Response(status_code=204)
