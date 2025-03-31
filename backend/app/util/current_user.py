"""Current user dependency."""

from fastapi import HTTPException, Security, Depends
from models.user import User
from jwt import access_security, user_from_credentials

from fastapi import Security, HTTPException
from fastapi_jwt import JwtAuthorizationCredentials

async def current_user(
    auth: JwtAuthorizationCredentials | None = Security(access_security)
) -> User | None:
    """Return the current authorized user if a token is provided, otherwise return None."""

    if not auth:  # No token provided, allow request to proceed anonymously
        return None

    try:
        user = await user_from_credentials(auth)  # Fetch user from the database

        if not user:
            raise HTTPException(404, "Authorized user could not be found")
    except Exception as e:
        raise HTTPException(401, f"Invalid or expired token: {str(e)}")

    return user
