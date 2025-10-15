from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.post_repository import PostRepository
from app.schemas.post import PostResponse, PostCreate, PostUpdate
from typing import List
from fastapi import HTTPException # HTTPException 임포트 추가

class PostService:
    @staticmethod
    async def get_posts(db: AsyncSession, skip: int = 0, limit: int = 10, sort: str = "desc") -> List[PostResponse]:
        posts_data = await PostRepository.get_posts(db, skip, limit, sort)
        # PostRepository에서 이미 필요한 데이터를 조합했으므로, PostResponse 스키마로 변환
        return [PostResponse.model_validate(data) for data in posts_data]

    @staticmethod
    async def get_total_posts_count(db: AsyncSession) -> int:
        return await PostRepository.get_total_posts_count(db)
    
    @staticmethod
    async def get_post_detail(db: AsyncSession, post_id: int) -> PostResponse | None:
        post = await PostRepository.get_post_by_id(db, post_id)
        if not post:
            return None

        # 조회수 증가
        await PostService.increment_post_views(db, post_id)

        # 작성자 닉네임과 댓글 수 추가
        author_nickname = post.author.nickname if post.author else "Unknown"
        comment_count = len(post.comments) if post.comments else 0

        # PostResponse 스키마에 맞게 데이터 구성
        return PostResponse(
            id=post.id,
            user_id=post.user_id,
            title=post.title,
            content=post.content,
            views=post.views,
            author=author_nickname,
            comments=comment_count,
            created_at=post.created_at,
            updated_at=post.updated_at
        )
    
    @staticmethod
    async def increment_post_views(db: AsyncSession, post_id: int):
        post = await PostRepository.get_post_by_id(db, post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        post.views += 1
        await db.commit()
        await db.refresh(post)

    @staticmethod
    async def create_post(db: AsyncSession, post_create: PostCreate, user_id: int) -> PostResponse:
        db_post = await PostRepository.create_post(db, post_create, user_id)
        
        # 서비스 계층에서 커밋 처리
        await db.commit()

        # 새로 생성된 게시물을 ID로 다시 조회하여 author 관계를 즉시 로드
        # PostRepository.get_post_by_id는 이미 selectinload를 사용하므로 안전함
        refreshed_post = await PostRepository.get_post_by_id(db, db_post.id)
        if not refreshed_post:
            # 이 경우는 발생해서는 안 되지만, 방어적으로 처리
            raise HTTPException(status_code=500, detail="Failed to retrieve created post details.")

        # 생성된 게시물 정보를 PostResponse 스키마에 맞춰 반환
        author_nickname = refreshed_post.author.nickname if refreshed_post.author else "Unknown"
        comment_count = len(refreshed_post.comments) if refreshed_post.comments else 0 # 새로 생성된 게시물은 댓글이 0개

        return PostResponse(
            id=db_post.id,
            user_id=db_post.user_id,
            title=db_post.title,
            content=db_post.content,
            views=db_post.views,
            author=author_nickname,
            comments=comment_count,
            created_at=db_post.created_at,
            updated_at=db_post.updated_at
        )

    @staticmethod
    async def update_post(
        db: AsyncSession, post_id: int, post_update: PostUpdate, user_id: int
    ) -> PostResponse:
        post = await PostRepository.get_post_by_id(db, post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        if post.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this post")

        updated_post = await PostRepository.update_post(
            db, post, post_update.title, post_update.content
        )
        await db.commit()
        await db.refresh(updated_post)

        author_nickname = updated_post.author.nickname if updated_post.author else "Unknown"
        comment_count = len(updated_post.comments) if updated_post.comments else 0

        return PostResponse(
            id=updated_post.id,
            user_id=updated_post.user_id,
            title=updated_post.title,
            content=updated_post.content,
            views=updated_post.views,
            author=author_nickname,
            comments=comment_count,
            created_at=updated_post.created_at,
            updated_at=updated_post.updated_at
        )

    @staticmethod
    async def delete_post(db: AsyncSession, post_id: int, user_id: int):
        post = await PostRepository.get_post_by_id(db, post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        if post.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this post")

        await PostRepository.delete_post(db, post)
        await db.commit()
