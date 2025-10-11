from datetime import datetime, timedelta
from jose import JWTError, jwt
from models.user import User
from config import CONFIG

RESET_EXPIRES = timedelta(hours=1)

def create_register_token(user: User) -> str:
    payload = {
        "sub": user.email,
        "scope": "email_confirm",
        "exp": datetime.now() + RESET_EXPIRES
    }
    return jwt.encode(payload, CONFIG.authjwt_secret_key, algorithm="HS256")

def create_reset_token(user: User) -> str:
    payload = {
        "sub": user.email,
        "scope": "password_reset",
        "exp": datetime.now() + RESET_EXPIRES
    }
    return jwt.encode(payload, CONFIG.authjwt_secret_key, algorithm="HS256")


async def verify_reset_token(token: str, scope: str) -> User | None:
    try:
        payload = jwt.decode(token, CONFIG.authjwt_secret_key, algorithms=["HS256"])
        if payload.get("scope") != scope:
            return None
        email = payload.get("sub")
        if not email:
            return None
        user = await User.by_email(email)
        return user
    except JWTError:
        return None