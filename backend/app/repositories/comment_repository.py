from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
from app.models.comment import Comment
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentUpdate, CommentResponse
from datetime import datetime
from typing import List, Optional

class CommentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _get_comment_with_author(self, comment_id: int) -> Optional[CommentResponse]:
        result = await self.db.execute(
            select(Comment, User.nickname.label("author"))
            .join(User, Comment.user_id == User.id)
            .filter(Comment.comment_id == comment_id)
        )
        row = result.first()
        if row:
            comment, author_name = row
            return CommentResponse(
                comment_id=comment.comment_id,
                post_id=comment.post_id,
                user_id=comment.user_id,
                content=comment.content,
                author=author_name,
                created_at=comment.created_at,
                updated_at=comment.updated_at
            )
        return None

    async def create_comment(self, comment_create: CommentCreate, user_id: int) -> CommentResponse:
        db_comment = Comment(
            post_id=comment_create.post_id,
            user_id=user_id,
            content=comment_create.content
        )
        self.db.add(db_comment)
        await self.db.commit()
        await self.db.refresh(db_comment)
        # 생성 후 CommentResponse 형태로 반환하기 위해 다시 조회
        return await self._get_comment_with_author(db_comment.comment_id)

    async def get_comment_by_id(self, comment_id: int) -> Optional[CommentResponse]:
        return await self._get_comment_with_author(comment_id)

    async def get_comments_by_post_id(self, post_id: int) -> List[CommentResponse]:
        result = await self.db.execute(
            select(Comment, User.nickname.label("author"))
            .join(User, Comment.user_id == User.id)
            .filter(Comment.post_id == post_id)
            .order_by(Comment.created_at)
        )
        comment_responses = []
        for comment, author_name in result.all():
            comment_responses.append(CommentResponse(
                comment_id=comment.comment_id,
                post_id=comment.post_id,
                user_id=comment.user_id,
                content=comment.content,
                author=author_name,
                created_at=comment.created_at,
                updated_at=comment.updated_at
            ))
        return comment_responses

    async def update_comment(self, comment_id: int, comment_update: CommentUpdate) -> Optional[CommentResponse]:
        # 먼저 댓글을 가져와서 업데이트
        stmt = select(Comment).filter(Comment.comment_id == comment_id)
        result = await self.db.execute(stmt)
        db_comment = result.scalars().first()

        if db_comment:
            db_comment.content = comment_update.content
            db_comment.updated_at = datetime.now()
            await self.db.commit()
            await self.db.refresh(db_comment)
            return await self._get_comment_with_author(db_comment.comment_id)
        return None

    async def delete_comment(self, comment_id: int) -> bool:
        stmt = select(Comment).filter(Comment.comment_id == comment_id)
        result = await self.db.execute(stmt)
        db_comment = result.scalars().first()

        if db_comment:
            await self.db.delete(db_comment)
            await self.db.commit()
            return True
        return False
