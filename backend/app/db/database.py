from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

DATABASE_URL = "mysql+asyncmy://myuser:mypassword@localhost:3306/mydb"

# DB와 실제 연결을 관리하는 엔진 생성
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # SQL 출력 확인용 (실무에서는 False 권장)
)

# Base 모델 선언(ORM 모델의 부모 클래스 역할)
Base = declarative_base()

# DB와 실제 쿼리를 날릴 때 사용하는 세션(session) 객체 생성 factory
# 요청(Request)마다 독립적인 세션 객체를 만들 수 있도록 준비.
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autoflush=False,
)

# DB 세션 의존성
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
