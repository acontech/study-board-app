"""
기능:
    서버 실행시 DB 연결이 정상인지 테스트 한다.
"""
from fastapi import FastAPI
from sqlalchemy import text
from contextlib import asynccontextmanager
from app.db.database import AsyncSessionLocal

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 서버 시작 시 실행
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(text("SELECT 1"))
            print("✅ DB 연결 성공:", result.scalar())
    except Exception as e:
        print("❌ DB 연결 실패:", e)

    yield  # 여기서 실제 앱이 실행됨

    # 서버 종료 시 실행
    print("👋 서버 종료")

app = FastAPI(lifespan=lifespan)