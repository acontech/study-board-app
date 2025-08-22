"""
기능:
    main.py 와 다른 경로에 정의된 API 의 import 테스트 용도.

"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.database import get_db

# /api/test 를 위한 라우터 그룹 생성
router = APIRouter(prefix="/api/test", tags=["test"])

@router.get("")
async def check_db(db: AsyncSession = Depends(get_db)):
    """_summary_

    Args:
        db (AsyncSession, optional): db 세션. Defaults to Depends(get_db).

    Raises:
        HTTPException: DB 연결이 안되는 경우(500)

    Returns:
        _type_: 성공 여부
    """
    try:
        result = await db.execute(text("SELECT 1"))
        return {"message": f"DB 연결 성공:{result.scalar}"}
    except Exception as e:
        print("DB 연결 실패:", e)
        raise HTTPException(status_code=500, detail="Database error")
