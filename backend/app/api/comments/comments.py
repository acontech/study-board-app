from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession # AsyncSession 임포트
from typing import List

from app.db.database import get_db
from app.schemas.comment import CommentCreate, CommentUpdate, CommentResponse
from app.services.comment_service import CommentService
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/api",
    tags=["comments"]
)

@router.post("/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment_api(
    comment_create: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = CommentService(db)
    comment = await service.create_comment(comment_create, current_user.id)
    return comment

@router.get("/posts/{post_id}/comments", response_model=List[CommentResponse])
async def get_comments_for_post_api(
    post_id: int,
    db: AsyncSession = Depends(get_db)
):
    service = CommentService(db)
    comments = await service.get_comments_by_post_id(post_id)
    return comments

@router.put("/comments/{comment_id}", response_model=CommentResponse)
async def update_comment_api(
    comment_id: int,
    comment_update: CommentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = CommentService(db)
    updated_comment = await service.update_comment(comment_id, comment_update, current_user.id)
    if not updated_comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found or not authorized")
    return updated_comment

@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment_api(
    comment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = CommentService(db)
    if not await service.delete_comment(comment_id, current_user.id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found or not authorized")
    return