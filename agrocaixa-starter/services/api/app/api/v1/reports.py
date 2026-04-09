from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.category import Category
from app.db_models.transaction import Transaction
from app.schemas.transaction import TransactionSummary

router = APIRouter(prefix="/reports", tags=["reports"])

#Obtendo sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/monthly-summary", response_model=TransactionSummary)
def monthly_summary(db: Session = Depends(get_db)) -> TransactionSummary:
    categories = db.query(Category).all()

    total_income = 0.0
    total_expense = 0.0

    category_data = {}

    for category in categories:
        # Entradas e saídas de cada categoria
        income = db.query(Transaction).filter(
            Transaction.category == category.name, Transaction.type == "income"
        ).all()

        expense = db.query(Transaction).filter(
            Transaction.category == category.name, Transaction.type == "expense"
        ).all()

        category_data[category.name] = {
            "income": sum(t.amount for t in income),
            "expense": sum(t.amount for t in expense),
            "balance": sum(t.amount for t in income) - sum(t.amount for t in expense),
        }

        total_income += sum(t.amount for t in income)
        total_expense += sum(t.amount for t in expense)

    return TransactionSummary(
        income=round(total_income, 2),
        expense=round(total_expense, 2),
        balance=round(total_income - total_expense, 2),
        total_transactions=len(db.query(Transaction).all()),
    )
