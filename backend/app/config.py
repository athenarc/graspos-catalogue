"""FastAPI server configuration."""

from decouple import config, UndefinedValueError
from pydantic import BaseModel


class Settings(BaseModel):
    """Server configuration settings."""

    # -------------------------------
    # SERVER SETTINGS
    # -------------------------------
    root_url: str = config("ROOT_URL", default="http://localhost:8080")

    # -------------------------------
    # MONGO SETTINGS
    # -------------------------------
    mongo_user: str = config("MONGO_INITDB_ROOT_USERNAME", default="graspos")
    try:
        mongo_pass: str = config("MONGO_INITDB_ROOT_PASSWORD")
    except UndefinedValueError:
        raise RuntimeError(
            "Missing environment variable: MONGO_INITDB_ROOT_PASSWORD. "
            "Please set it in your .env file or environment.")
    mongo_host: str = config("MONGO_HOST", default="mongodb")
    mongo_container_port: str = config("MONGO_CONTAINER_PORT", default=27017)
    mongo_initdb_database: str = config("MONGO_INITDB_DATABASE",
                                        default="graspos")
    mongodb_uri: str = f"mongodb://{mongo_user}:{mongo_pass}@{mongo_host}:{mongo_container_port}/"

    mongo_super_user: str = config("MONGO_SUPER_USER", default="super_user")
    mongo_super_user_password: str = config("MONGO_SUPER_USER_PASSWORD",
                                            default="super_user")

    # -------------------------------
    # SECURITY SETTINGS
    # -------------------------------
    try:
        authjwt_secret_key: str = config("SECRET_KEY")
    except UndefinedValueError:
        raise RuntimeError("Missing environment variable: SECRET_KEY. "
                           "Please set it in your .env file or environment.")

    try:
        salt: bytes = config("SALT").encode()
    except UndefinedValueError:
        raise RuntimeError("Missing environment variable: SALT. "
                           "Please set it in your .env file or environment.")

    try:
        default_user_password: str = config("DEFAULT_USER_PASSWORD")
    except UndefinedValueError:
        raise RuntimeError(
            "Missing environment variable: DEFAULT_USER_PASSWORD. "
            "Please set it in your .env file or environment.")

    # -------------------------------
    # MAIL SETTINGS
    # -------------------------------
    mail_console: bool = config("MAIL_CONSOLE", default=False, cast=bool)
    mail_server: str = config("MAIL_SERVER", default="smtp.myserver.io")
    mail_port: int = config("MAIL_PORT", default=587, cast=int)
    mail_username: str = config("MAIL_USERNAME", default="")
    mail_password: str = config("MAIL_PASSWORD", default="")
    mail_sender: str = config("MAIL_SENDER", default="noreply@myserver.io")


# Δημιουργία του global CONFIG instance
CONFIG = Settings()
