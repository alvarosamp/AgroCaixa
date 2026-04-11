from sqlachemy import Column, Integer, String, ForeignKey
from app.db import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=False)
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=True, index=True)
    type = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    date = Column(String, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, nullable=True)
