from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.models.post import Post
from app.models.user import User
from app.models.comment import Comment
from app.schemas.post import PostCreate
from typing import Optional

class PostRepository:
    @staticmethod
    async def get_posts(db: AsyncSession, skip: int = 0, limit: int = 10, sort: str = "desc") -> list:
        # 게시물과 작성자 정보를 함께 로드하고, 각 게시물의 댓글 수를 계산
        order_by_clause = Post.created_at.desc() if sort == "desc" else Post.created_at.asc()
        stmt = (
            select(
                Post,
                User.nickname.label("author_nickname"),
                func.count(Comment.comment_id).label("comment_count")
            )
            .join(User, Post.user_id == User.id)
            .outerjoin(Comment, Post.id == Comment.post_id)
            .group_by(Post.id, User.nickname)
            .order_by(order_by_clause)
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(stmt)
        posts_data = []
        for post, author_nickname, comment_count in result:
            posts_data.append({
                "id": post.id,
                "user_id": post.user_id,
                "title": post.title,
                "content": post.content,
                "views": post.views,
                "author": author_nickname,
                "comments": comment_count,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
            })
        return posts_data

    @staticmethod
    async def get_total_posts_count(db: AsyncSession) -> int:
        result = await db.execute(select(func.count(Post.id)))
        return result.scalar_one_or_none() or 0 # 1개의 정수값 반환, 없으면 None을 0으로 반환

    @staticmethod
    async def get_post_by_id(db: AsyncSession, post_id: int) -> Post | None:
        result = await db.execute(
            select(Post)
            .options(selectinload(Post.author), selectinload(Post.comments)) # models 에 reloationship 을 정의해두어 ForeignKey 를 참조하여 데이터를 미리 로드해 올수 있음
            .filter(Post.id == post_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def create_post(db: AsyncSession, post_create: PostCreate, user_id: int) -> Post:
        db_post = Post(**post_create.model_dump(), user_id=user_id) # .dict() 와 같음. Pydantic v2에서 쓰는 메서드. **은 딕셔너리를 풀어서 매핑
        db.add(db_post)
        return db_post

    @staticmethod
    async def update_post(db: AsyncSession, post: Post, title: Optional[str], content: Optional[str]) -> Post:
        if title is not None:
            post.title = title
        if content is not None:
            post.content = content
        # 실제 쿼리를 실행하지 않아도 persistent 상태 → 세션이 추적중이므로 해당 post의 id 로 SQLAlchemy 내부에서 update가 실행된다
        await db.flush()
        await db.refresh(post)
        return post

    @staticmethod
    async def delete_post(db: AsyncSession, post: Post):
        await db.delete(post)
