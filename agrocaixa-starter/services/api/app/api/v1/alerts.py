from datetime import date, timedelta
from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db
from app.models.transaction import Transaction
from app.models.user import User

router = APIRouter(prefix="/alerts", tags=["alerts"])


class AlertResponse(BaseModel):
    id: int
    message: str
    date: date
    type: str


@router.get("/", response_model=List[AlertResponse])
def list_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[AlertResponse]:
    today = date.today()
    start_current_month = today.replace(day=1)

    end_previous_month = start_current_month - timedelta(days=1)
    start_previous_month = end_previous_month.replace(day=1)

    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == current_user.id,
            Transaction.date >= start_previous_month,
            Transaction.date <= today,
        )
        .all()
    )

    prev_month = [
        t for t in transactions if start_previous_month <= t.date <= end_previous_month
    ]
    current_month = [t for t in transactions if t.date >= start_current_month]

    prev_expense = sum(t.amount for t in prev_month if t.type == "expense")
    current_expense = sum(t.amount for t in current_month if t.type == "expense")

    prev_income = sum(t.amount for t in prev_month if t.type == "income")
    current_income = sum(t.amount for t in current_month if t.type == "income")

    alerts: list[AlertResponse] = []

    if prev_expense > 0 and current_expense > prev_expense * 1.2:
        diff = current_expense - prev_expense
        alerts.append(
            AlertResponse(
                id=len(alerts) + 1,
                type="expense",
                date=today,
                message=(
                    f"Seus gastos aumentaram R$ {diff:.2f} este mês "
                    "em comparação ao mês anterior."
                ),
            )
        )

    if prev_income > 0 and current_income < prev_income * 0.8:
        diff = prev_income - current_income
        alerts.append(
            AlertResponse(
                id=len(alerts) + 1,
                type="income",
                date=today,
                message=(
                    f"Sua renda caiu R$ {diff:.2f} este mês "
                    "em comparação ao mês anterior."
                ),
            )
        )

    return alerts

@router.patch("/{alert_id}/read")
def mark_as_read(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    alert = db.query(FinancialAlert).filter(
        FinancialAlert.id == alert_id,
        FinancialAlert.user_id == current_user.id
    ).first()

    if not alert:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")

    alert.read = True
    db.commit()

    return {"message": "Alerta marcado como lido"}
