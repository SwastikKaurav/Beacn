from database import Base
from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    endpoints = relationship("Endpoint", back_populates="user")

class Endpoint(Base):
    __tablename__ = "endpoints"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey(User.id), nullable=False)
    name = Column(String)
    url = Column(String)
    ping_interval = Column(Integer)
    ping_results = relationship("PingResult", back_populates="endpoint")
    user = relationship("User", back_populates="endpoints")

class PingResult(Base):
    __tablename__ = "ping_results"
    id = Column(Integer, primary_key=True)
    endpoint_id = Column(Integer, ForeignKey(Endpoint.id))
    status_code = Column(Integer)
    response_time = Column(Float)
    checked_at = Column(DateTime)
    endpoint = relationship("Endpoint", back_populates="ping_results")

