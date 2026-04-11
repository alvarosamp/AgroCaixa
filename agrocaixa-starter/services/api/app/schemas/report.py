from pydantic import BaseModel


class FinancialSummaryResponse(BaseModel):
    income: float
    expense: float
    balance: float
    total_transactions: int


class ActivityReportItem(BaseModel):
    activity_id: int
    activity_name: str
    income: float
    expense: float
    balance: float


class CategoryReportItem(BaseModel):
    category: str
    total: float
    transactions_count: int
