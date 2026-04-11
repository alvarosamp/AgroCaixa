from sqlalchemy import Column, Date, Float, ForeignKey, Integer, String
from app.db import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=True, index=True)
    type = Column(String(20), nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    description = Column(String(255), nullable=True)
    activity_name = Column(String(255), nullable=True)
    category = Column(String(100), nullable=True)
