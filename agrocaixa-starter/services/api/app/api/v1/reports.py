from collections import defaultdict
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db
from app.models.activity import Activity
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.report import (
    ActivityReportItem,
    CategoryReportItem,
    FinancialSummaryResponse,
)

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/summary", response_model=FinancialSummaryResponse)
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FinancialSummaryResponse:
    transactions = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .all()
    )

    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")

    return FinancialSummaryResponse(
        income=round(total_income, 2),
        expense=round(total_expense, 2),
        balance=round(total_income - total_expense, 2),
        total_transactions=len(transactions),
    )


@router.get("/by-activity", response_model=List[ActivityReportItem])
def get_report_by_activity(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[ActivityReportItem]:
    rows = (
        db.query(Transaction, Activity)
        .join(Activity, Transaction.activity_id == Activity.id)
        .filter(Transaction.user_id == current_user.id)
        .all()
    )

    grouped = {}

    for transaction, activity in rows:
        if activity.id not in grouped:
            grouped[activity.id] = {
                "activity_id": activity.id,
                "activity_name": activity.name,
                "income": 0.0,
                "expense": 0.0,
            }

        if transaction.type == "income":
            grouped[activity.id]["income"] += transaction.amount
        elif transaction.type == "expense":
            grouped[activity.id]["expense"] += transaction.amount

    result = []
    for item in grouped.values():
        result.append(
            ActivityReportItem(
                activity_id=item["activity_id"],
                activity_name=item["activity_name"],
                income=round(item["income"], 2),
                expense=round(item["expense"], 2),
                balance=round(item["income"] - item["expense"], 2),
            )
        )

    return result


@router.get("/by-category", response_model=List[CategoryReportItem])
def get_report_by_category(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[CategoryReportItem]:
    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
        )
        .all()
    )

    grouped = defaultdict(lambda: {"total": 0.0, "transactions_count": 0})

    for transaction in transactions:
        category = transaction.category or "sem_categoria"
        grouped[category]["total"] += transaction.amount
        grouped[category]["transactions_count"] += 1

    result = []
    for category, values in grouped.items():
        result.append(
            CategoryReportItem(
                category=category,
                total=round(values["total"], 2),
                transactions_count=values["transactions_count"],
            )
        )

    result.sort(key=lambda x: x.total, reverse=True)
    return result
