from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # CORS 미들웨어 임포트
from app.api.test import test
from app.api.posts import posts # posts 라우터 모듈 임포트
from app.api.users import users # users 라우터 모듈 임포트
from app.api.comments import comments # comments 라우터 모듈 임포트

app = FastAPI()

# CORS 설정
origins = [
    "http://localhost:3000",  # 프론트엔드 URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(test.router)
app.include_router(posts.router)
app.include_router(users.router) # users 라우터 객체 포함
app.include_router(comments.router) # comments 라우터 객체 포함

@app.get("/")
def hello():
    return {"message": "Hello, FastAPI!"}