"""User router."""

from fastapi import APIRouter, Body, Depends, HTTPException, Response, Security, status
from fastapi_jwt import JwtAuthorizationCredentials

from models.user import User, UserOut, UserPasswordUpdate, UserPasswordReset
from jwt import access_security
from util.current_user import current_user_mandatory
from beanie import PydanticObjectId
from util.password import hash_password
from config import CONFIG

router = APIRouter(prefix="/api/v1/user", tags=["User"])


@router.get("", response_model=UserOut)
async def get_user(user: User = Depends(current_user_mandatory)
                   ):  # type: ignore[no-untyped-def]
    """Return the current user."""
    return user


@router.get("/users", response_model=list[UserOut])
async def get_all_users(user: User = Depends(current_user_mandatory)
                        ):  # type: ignore[no-untyped-def]
    """Return the current user."""
    users = await User.find_all().to_list()
    return users


@router.get("/{user_id}")
async def get_user(user_id: PydanticObjectId,
                   user: User = Depends(current_user_mandatory)
                   ):  # type: ignore[no-untyped-def]
    """Return the current user."""
    userOut = await User.by_id(user_id)
    if userOut is None:
        raise HTTPException(404, "User not found")
    return {"username": userOut.username}


@router.patch("", response_model=UserOut)
async def update_user(update: UserPasswordUpdate,
                      user: User = Depends(current_user_mandatory)
                      ):  # type: ignore[no-untyped-def]
    """Update allowed user fields."""
    fields = update.model_dump(exclude_unset=True)
    user = await User.get(fields["id"])
    user = User.model_copy(user, update=fields)
    if update.password:
        if hash_password(update.password) != user.password:
            user.password = hash_password(update.password)
    await user.save()
    return user


@router.patch("/reset", response_model=UserOut)
async def reset_user_password(
    update: UserPasswordReset,
    current_user: User = Depends(current_user_mandatory)):
    """
    Reset a user's password to the default password in CONFIG.
    Updates only if the password is different from the current one.
    """

    default_hashed_pw = hash_password(CONFIG.default_user_password)

    # If the default password is the same as the current one, do nothing
    if current_user.password == default_hashed_pw:
        return current_user

    # Atomic update in the database
    updated_count = await User.find_one(User.id == update.id).update(
        {"$set": {
            "password": default_hashed_pw
        }})

    if not updated_count:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found")

    # Fetch the updated user object to return it
    updated_user = await User.get(update.id)
    return updated_user


@router.post("/reset-password")
async def reset_user_password(
        # update: UserPasswordReset,
        password: str = Body(..., embed=True),
        new_password: str = Body(..., embed=True),
        current_user: User = Depends(current_user_mandatory)):
    """
    Reset a user's password to the default password in CONFIG.
    Updates only if the password is different from the current one.
    """

    # Verify the old password
    if current_user.password != hash_password(password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Old password is incorrect")
    # If the new password is the same as the current one, do nothing
    new_hashed_pw = hash_password(new_password)
    if current_user.password == new_hashed_pw:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from the old one")

    # Atomic update in the database
    updated_count = await User.find_one(User.id == current_user.id).update(
        {"$set": {
            "password": new_hashed_pw
        }})
    if not updated_count:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found")

    # Fetch the updated user object to return it
    updated_user = await User.get(current_user.id)
    return updated_user


@router.delete("")
async def delete_user(auth: JwtAuthorizationCredentials = Security(
    access_security)) -> Response:
    """Delete current user."""
    await User.find_one(User.email == auth.subject["username"]).delete()
    return Response(status_code=204)
