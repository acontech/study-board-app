from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.schemas.user import UserCreate

class UserRepository:
    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: int) -> User | None:
        result = await db.execute(select(User).filter(User.id == user_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_by_nickname(db: AsyncSession, nickname: str) -> User | None:
        result = await db.execute(select(User).filter(User.nickname == nickname))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
        result = await db.execute(select(User).filter(User.email == email))
        return result.scalar_one_or_none() 
    # 결과가 없으면 none, 있으면 error 

    @staticmethod
    async def create_user(db: AsyncSession, user_create: UserCreate) -> User:
        db_user = User(**user_create.model_dump()) # .dict() 와 같음. Pydantic v2에서 쓰는 메서드. **은 딕셔너리를 풀어서 매핑
        db.add(db_user)
        await db.flush() # ID를 할당하기 위해 flush
        await db.refresh(db_user)
        return db_user
