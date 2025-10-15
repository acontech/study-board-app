from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.orm import relationship
from app.db.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    nickname = Column(String(100), unique=True, index=True, nullable=False)
    birthdate = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    posts = relationship("Post", back_populates="author")
    comments = relationship("Comment", back_populates="author")
