from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserResponse
import app.core.security as security # security 모듈 전체 임포트
from datetime import timedelta
from fastapi import HTTPException

class UserService:
    @staticmethod
    async def register_user(db: AsyncSession, user_create: UserCreate) -> UserResponse:
        # 이메일 중복 확인
        existing_user = await UserRepository.get_user_by_email(db, user_create.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="사용중인 이메일 입니다.")

        # 닉네임 중복 확인
        existing_nickname = await UserRepository.get_user_by_nickname(db, user_create.nickname)
        if existing_nickname:
            raise HTTPException(status_code=400, detail="사용중인 닉네임 입니다.")

        # 비밀번호 해싱
        hashed_password = security.get_password_hash(user_create.password)
        user_create.password = hashed_password

        db_user = await UserRepository.create_user(db, user_create)
        await db.commit()
        await db.refresh(db_user)
        return UserResponse.model_validate(db_user) # model_validate 은 ORM 객체를 모델로 변환하는 메서드

    @staticmethod
    async def check_email_exists(db: AsyncSession, email: str) -> bool:
        user = await UserRepository.get_user_by_email(db, email)
        return user is not None
    
    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: int) -> UserResponse | None:
        user = await UserRepository.get_user_by_id(db, user_id)
        if not user:
            return None
        return UserResponse.model_validate(user)

    @staticmethod
    async def authenticate_user(db: AsyncSession, email: str, password: str) -> UserResponse | None:
        user = await UserRepository.get_user_by_email(db, email)
        if not user or not security.verify_password(password, user.password):
            return None
        return UserResponse.model_validate(user)

    @staticmethod
    async def create_user_access_token(user: UserResponse) -> str:
        access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
        return security.create_access_token(
            data={"user_email": user.email, "user_id": user.id, "nickname": user.nickname},
            expires_delta=access_token_expires
        )