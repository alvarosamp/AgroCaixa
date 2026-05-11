from datetime import date, datetime, timedelta

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
    today = date.today()
    start_current_month = today.replace(day=1)
    end_previous_month = start_current_month - timedelta(days=1)
    start_previous_month = end_previous_month.replace(day=1)
    month_key = start_current_month.strftime("%Y-%m")

    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == user_id,
            Transaction.date >= start_previous_month,
            Transaction.date <= today,
        )
        .all()
    )

    prev_month = [
        transaction
        for transaction in transactions
        if start_previous_month <= transaction.date <= end_previous_month
    ]
    current_month = [
        transaction
        for transaction in transactions
        if transaction.date >= start_current_month
    ]

    prev_expense = sum(
        transaction.amount for transaction in prev_month if transaction.type == "expense"
    )
    current_expense = sum(
        transaction.amount
        for transaction in current_month
        if transaction.type == "expense"
    )

    prev_income = sum(
        transaction.amount for transaction in prev_month if transaction.type == "income"
    )
    current_income = sum(
        transaction.amount
        for transaction in current_month
        if transaction.type == "income"
    )

    if prev_expense > 0 and current_expense > prev_expense * 1.20:
        increase_value = current_expense - prev_expense
        create_alert_if_not_exists(
            db=db,
            user_id=user_id,
            key=f"expense_increase_20_percent:{month_key}",
            message=(
                f"Seus gastos subiram R$ {increase_value:.2f} neste mês "
                "em comparação ao mês anterior."
            ),
            type_="expense",
        )

    if prev_income > 0 and current_income < prev_income * 0.80:
        decrease_value = prev_income - current_income
        create_alert_if_not_exists(
            db=db,
            user_id=user_id,
            key=f"income_drop_20_percent:{month_key}",
            message=(
                f"Sua receita caiu R$ {decrease_value:.2f} neste mês "
                "em comparação ao mês anterior."
            ),
            type_="income",
        )


def list_financial_alerts(db: Session, user_id: int) -> list[FinancialAlert]:
    generate_financial_alerts(db, user_id)

    return (
        db.query(FinancialAlert)
        .filter(FinancialAlert.user_id == user_id)
        .order_by(FinancialAlert.date.desc(), FinancialAlert.id.desc())
        .all()
    )


def count_unread_alerts(db: Session, user_id: int) -> int:
    generate_financial_alerts(db, user_id)

    return (
        db.query(FinancialAlert)
        .filter(
            FinancialAlert.user_id == user_id,
            FinancialAlert.read.is_(False),
        )
        .count()
    )


def mark_alert_as_read(
    db: Session,
    user_id: int,
    alert_id: int,
) -> FinancialAlert | None:
    alert = (
        db.query(FinancialAlert)
        .filter(
            FinancialAlert.id == alert_id,
            FinancialAlert.user_id == user_id,
        )
        .first()
    )

    if alert is None:
        return None

    if not alert.read:
        alert.read = True
        db.commit()
        db.refresh(alert)

    return alert
