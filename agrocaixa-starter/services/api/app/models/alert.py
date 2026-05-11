from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String

from app.db import Base


class FinancialAlert(Base):
    __tablename__ = "financial_alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    message = Column(String, nullable=False)
    date = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    read = Column(Boolean, nullable=False, default=False, index=True)
    type = Column(String, nullable=False, index=True)
    key = Column(String, nullable=False, index=True)
