from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.db.database import get_db
from app.services.user_service import UserService
from app.schemas.user import UserResponse

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# TODO: 실제 환경에서는 환경 변수에서 로드해야 합니다.
SECRET_KEY = "your-super-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/users/login")

# 비밀번호 해싱 처리
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# DB에 저장된 해싱된 비밀번호와 사용자가 입력한 비밀번호를 해싱하여 비교하여 boolean 으로 리턴
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# ACCESS TOKEN 생성
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "user_id": data["user_id"], "user_email": data["user_email"], "nickname": data["nickname"]})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> UserResponse:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
        
        # 데이터베이스에서 실제 사용자 정보 조회
        user_from_db = await UserService.get_user_by_id(db, user_id)
        if not user_from_db:
            raise credentials_exception
        
        return UserResponse.model_validate(user_from_db) # 실제 DB에서 가져온 User 객체를 스키마로 변환
    except jwt.PyJWTError:
        raise credentials_exception
