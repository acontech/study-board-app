from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PostBase(BaseModel):
    title: str
    content: str

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class PostResponse(PostBase):
    id: int
    user_id: int
    author: str # 작성자 닉네임
    views: int
    comments: int # 댓글 수
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True # ORM 객체를 dict 형태로 전환하지 않아도 pydantic 모델 값으로 쓸수 있도록 하는 옵션
