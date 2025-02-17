"""User models."""

from datetime import datetime
from typing import Annotated, Any, Optional

from beanie import Document, Indexed
from pydantic import BaseModel, EmailStr


class UserAuth(BaseModel):
    """User login auth."""
    username: str
    # email: EmailStr
    password: str


class UserAuthRegister(BaseModel):
    """User register auth."""
    
    username: str
    email: EmailStr
    password: str
    first_name: Optional[str] = None 
    last_name: Optional[str] = None 
    organization: Optional[str] = None 
    


class UserUpdate(BaseModel):
    """Updatable user fields."""

    email: EmailStr | None = None

    # User information
    first_name: str | None = None
    last_name: str | None = None
    super_user: bool | None = False
    username: str | None = False
    organization: str | None = False


class UserOut(UserUpdate):
    """User fields returned to the client."""

    email: Annotated[str, Indexed(EmailStr, unique=True)]
    disabled: bool = False


class User(Document, UserOut):
    """User DB representation."""

    password: str
    email_confirmed_at: datetime | None = None
    super_user: bool | None = False
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: str
    organization: Optional[str] = None

    def __repr__(self) -> str:
        return f"<User {self.email}>"

    def __str__(self) -> str:
        return self.email

    def __hash__(self) -> int:
        return hash(self.email)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, User):
            return self.email == other.email
        return False

    @property
    def created(self) -> datetime | None:
        """Datetime user was created from ID."""
        return self.id.generation_time if self.id else None

    @property
    def jwt_subject(self) -> dict[str, Any]:
        """JWT subject fields."""
        return {"username": self.email}

    @classmethod
    async def by_email(cls, email: str) -> Optional["User"]:
        """Get a user by email."""
        return await cls.find_one(cls.email == email)

    @classmethod
    async def by_username(cls, username: str) -> Optional["User"]:
        """Get a user by username."""
        return await cls.find_one(cls.username == username)

    def update_email(self, new_email: str) -> None:
        """Update email logging and replace."""
        # Add any pre-checks here
        self.email = new_email
