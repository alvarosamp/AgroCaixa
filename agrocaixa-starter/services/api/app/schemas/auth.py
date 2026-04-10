from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserResponse


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# Backwards-compatible alias (if any code still imports UserToken)
UserToken = TokenResponse
