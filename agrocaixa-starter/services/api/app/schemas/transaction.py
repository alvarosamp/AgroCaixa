from datetime import date
from typing import Literal, Optional

from pydantic import BaseModel, Field


class TransactionCreate(BaseModel):
    activity_id: Optional[int] = None
    type: Literal["income", "expense"]
    amount: float = Field(..., gt=0)
    date: date
    description: Optional[str] = None
    activity_name: Optional[str] = None
    category: Optional[str] = None


class TransactionResponse(TransactionCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class TransactionSummary(BaseModel):
    income: float
    expense: float
    balance: float
    total_transactions: int
