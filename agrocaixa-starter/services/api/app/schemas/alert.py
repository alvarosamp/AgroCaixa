from pydantic import BaseModel
from datetime import datetime

class FinancialAlertResponse(BaseModel):
    id: int
    user_id: int
    message: str
    date: datetime
    read: bool
    type: str

    class Config:
        from_attributes = True


class UnreadAlertsResponse(BaseModel):
    unread_count: int
