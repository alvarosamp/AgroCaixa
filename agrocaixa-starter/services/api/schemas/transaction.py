from datetime import date
from typing import Literal, Optional
from pydantic import BaseModel, Field

class TransactionCreate(BaseModel):
    type : Literal['income', 'expense']
    amount: flaot = Field(..., gt = 0)
    date : date
    description: Optional[str] = None
    activity_name : Optional[str] = None
    category: Optional[str] = None
