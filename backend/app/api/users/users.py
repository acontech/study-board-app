from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin, Token
from app.services.user_service import UserService

router = APIRouter(
    prefix="/api/users",
    tags=["users"]
)

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup_user(user_create: UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        new_user = await UserService.register_user(db, user_create)
        return new_user
    except HTTPException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/check-email", response_model=dict)
async def check_email(email: str = Query(..., description="Email to check for duplication"), db: AsyncSession = Depends(get_db)):
    exists = await UserService.check_email_exists(db, email)
    return {"exists": exists}

@router.post("/login", response_model=Token)
async def login_for_access_token(user_login: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await UserService.authenticate_user(db, user_login.email, user_login.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = await UserService.create_user_access_token(user)
    return {"access_token": access_token, "token_type": "bearer"}