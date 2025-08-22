"""
기능:
    서버 실행시 메인 지점
"""
from fastapi import FastAPI
from app.api.test import test

app = FastAPI()

# /app/api/test.py 라우터를 메인 앱에 추가(API 호출이 가능해 진다)
app.include_router(test.router)

@app.get("/")
def hello():
    """_summary_

    Returns:
        _type_: 테스트를 위한 기본값
    """
    return {"message": "Hello, FastAPI!"}
