from pydantic import BaseModel
from datetime import datetime

class AlertaFinancialSchema(BaseModel):
    id: int
    user_id: int
    message: str
    date: datetime
    read: bool
    type: str

    class Config:
        orm_mode = True
