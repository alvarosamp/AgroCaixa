from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models.alert import FinancialAlert
from app.models.transaction import Transaction


def create_alert_if_not_exists(
    db: Session,
    user_id: int,
    key: str,
    message: str,
    type_: str,
) -> None:
    existing = (
        db.query(FinancialAlert)
        .filter(
            FinancialAlert.user_id == user_id,
            FinancialAlert.key == key,
            FinancialAlert.read == False,
        )
        .first()
    )

    if existing:
        return

    alert = FinancialAlert(
        user_id=user_id,
        message=message,
        date=datetime.utcnow(),
        read=False,
        type=type_,
        key=key,
    )

    db.add(alert)
    db.commit()


def generate_financial_alerts(db: Session, user_id: int) -> None:
    now = datetime.utcnow()

    # início do mês atual
    start_current_month = datetime(now.year, now.month, 1)

    # início do mês passado
    if now.month == 1:
        start_previous_month = datetime(now.year - 1, 12, 1)
    else:
        start_previous_month = datetime(now.year, now.month - 1, 1)

    # fim do mês passado = início do mês atual
    end_previous_month = start_current_month

    # transações do mês passado
    previous_transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == user_id,
            Transaction.date >= start_previous_month.date(),
            Transaction.date < end_previous_month.date(),
        )
        .all()
    )

    # transações do mês atual
    current_transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == user_id,
            Transaction.date >= start_current_month.date(),
        )
        .all()
    )

    # despesas
    previous_expense = sum(
        t.amount for t in previous_transactions if t.type == "expense"
    )
    current_expense = sum(
        t.amount for t in current_transactions if t.type == "expense"
    )

    # receitas
    previous_income = sum(
        t.amount for t in previous_transactions if t.type == "income"
    )
    current_income = sum(
        t.amount for t in current_transactions if t.type == "income"
    )

    # alerta: gasto subiu mais de 20%
    if previous_expense > 0 and current_expense > previous_expense * 1.20:
        increase_value = current_expense - previous_expense

        create_alert_if_not_exists(
            db=db,
            user_id=user_id,
            key="expense_increase_20_percent",
            message=(
                f"Você gastou R$ {increase_value:.2f} a mais neste mês "
                f"em comparação ao mês anterior."
            ),
            type_="expense",
        )

    # alerta: receita caiu mais de 20%
    if previous_income > 0 and current_income < previous_income * 0.80:
        decrease_value = previous_income - current_income

        create_alert_if_not_exists(
            db=db,
            user_id=user_id,
            key="income_drop_20_percent",
            message=(
                f"Você recebeu R$ {decrease_value:.2f} a menos neste mês "
                f"em comparação ao mês anterior."
            ),
            type_="income",
        )