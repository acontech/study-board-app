from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.comment_repository import CommentRepository
from app.schemas.comment import CommentCreate, CommentUpdate, CommentResponse
from typing import List, Optional

class CommentService:
    def __init__(self, db: AsyncSession):
        self.comment_repo = CommentRepository(db)

    async def create_comment(self, comment_create: CommentCreate, user_id: int) -> CommentResponse:
        return await self.comment_repo.create_comment(comment_create, user_id)

    async def get_comment_by_id(self, comment_id: int) -> Optional[CommentResponse]:
        return await self.comment_repo.get_comment_by_id(comment_id)

    async def get_comments_by_post_id(self, post_id: int) -> List[CommentResponse]:
        return await self.comment_repo.get_comments_by_post_id(post_id)

    async def update_comment(self, comment_id: int, comment_update: CommentUpdate, user_id: int) -> Optional[CommentResponse]:
        comment = await self.comment_repo.get_comment_by_id(comment_id)
        if not comment or comment.user_id != user_id: # 작성자만 수정 가능
            return None
        return await self.comment_repo.update_comment(comment_id, comment_update)

    async def delete_comment(self, comment_id: int, user_id: int) -> bool:
        comment = await self.comment_repo.get_comment_by_id(comment_id)
        if not comment or comment.user_id != user_id: # 작성자만 삭제 가능
            return False
        return await self.comment_repo.delete_comment(comment_id)
