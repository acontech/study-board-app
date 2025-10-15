from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.post import PostResponse, PostCreate, PostUpdate
from app.services.post_service import PostService
from typing import List
from app.core.security import get_current_user # get_current_user 임포트
from app.schemas.user import UserResponse # UserResponse 임포트

router = APIRouter(
    prefix="/api/posts",
    tags=["posts"]
)

@router.get("/", response_model=List[PostResponse])
async def get_all_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    sort: str = Query("desc", pattern="^(asc|desc)$"),
    db: AsyncSession = Depends(get_db)
):
    posts = await PostService.get_posts(db, skip=skip, limit=limit, sort=sort)
    return posts

@router.get("/count", response_model=int)
async def get_total_posts_count(db: AsyncSession = Depends(get_db)):
    count = await PostService.get_total_posts_count(db)
    return count

@router.get("/{post_id}", response_model=PostResponse)
async def get_post_detail(post_id: int, db: AsyncSession = Depends(get_db)):
    post = await PostService.get_post_detail(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/", response_model=PostResponse, status_code=201)
async def create_post(post_create: PostCreate, db: AsyncSession = Depends(get_db), current_user: UserResponse = Depends(get_current_user)):
    user_id = current_user.id  # 로그인된 사용자의 ID 사용
    new_post = await PostService.create_post(db, post_create, user_id)
    return new_post

@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_update: PostUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    updated_post = await PostService.update_post(db, post_id, post_update, current_user.id)
    return updated_post

@router.delete("/{post_id}", status_code=204)
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user)
):
    await PostService.delete_post(db, post_id, current_user.id)
    return {"message": "Post deleted successfully"}
