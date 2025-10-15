from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    nickname: str
    birthdate: Optional[date] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True # ORM 객체를 dict 형태로 전환하지 않아도 pydantic 모델 값으로 쓸수 있도록 하는 옵션

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
