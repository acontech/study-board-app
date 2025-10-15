from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    post_id: int

class CommentUpdate(CommentBase):
    pass

class CommentResponse(CommentBase):
    comment_id: int
    post_id: int
    user_id: int
    author: str # 작성자 닉네임
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
