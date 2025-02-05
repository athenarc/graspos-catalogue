"""FastAPI server configuration."""

from decouple import config
from pydantic import BaseModel


class Settings(BaseModel):
    """Server config settings."""
    
    root_url: str = config("ROOT_URL", default="http://localhost:8080")
    
    # MONGO ENGINE SETTINGS
    mongo_user: str = config("MONGO_INITDB_ROOT_USERNAME")
    mongo_pass: str = config("MONGO_INITDB_ROOT_PASSWORD")
    mongo_host: str = config("MONGO_HOST")
    mongo_container_port: str = config("MONGO_CONTAINER_PORT")
    mongo_initdb_database: str = config("MONGO_INITDB_DATABASE")
    mongodb_uri: str = f"mongodb://{mongo_user}:{mongo_pass}@{mongo_host}:{mongo_container_port}/"

    # SECURITY SETTINGS
    authjwt_secret_key: str = config("SECRET_KEY")
    salt: bytes = config("SALT").encode()
    
    # MAIL SETTINGS
    mail_console: bool = config("MAIL_CONSOLE", default=False, cast=bool)
    mail_server: str = config("MAIL_SERVER", default="smtp.myserver.io")
    mail_port: int = config("MAIL_PORT", default=587, cast=int)
    mail_username: str = config("MAIL_USERNAME", default="")
    mail_password: str = config("MAIL_PASSWORD", default="")
    mail_sender: str = config("MAIL_SENDER", default="noreply@myserver.io")

CONFIG = Settings()
