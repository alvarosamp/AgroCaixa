from typing import List
import os

import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db
from app.models.activity import Activity
from app.models.farm import Farm
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
    TransactionSummary,
)

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post("/", response_model=TransactionResponse, status_code=201)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TransactionResponse:
    activity = (
        db.query(Activity)
        .join(Farm, Activity.farm_id == Farm.id)
        .filter(
            Activity.id == transaction.activity_id,
            Farm.user_id == current_user.id,
        )
        .first()
    )

    if not activity:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")

    ai_url = os.getenv("AI_SERVICE_URL", "http://localhost:8001")
    suggested_category = transaction.category

    if not suggested_category and transaction.description:
        try:
            response = httpx.post(
                f"{ai_url}/classify-smart",
                json={"description": transaction.description},
                timeout=20.0,
            )
            response.raise_for_status()
            suggested_category = response.json().get("category", "outros")
        except Exception:
            suggested_category = "outros"

    db_transaction = Transaction(
        user_id=current_user.id,
        activity_id=transaction.activity_id,
        type=transaction.type,
        amount=transaction.amount,
        date=transaction.date,
        description=transaction.description,
        category=suggested_category,
    )

    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


@router.get("/", response_model=List[TransactionResponse])
def list_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[TransactionResponse]:
    transactions = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .order_by(Transaction.id.desc())
        .all()
    )
    return transactions


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TransactionResponse:
    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id,
        )
        .first()
    )

    if not transaction:
        raise HTTPException(status_code=404, detail="Transação não encontrada")

    return transaction


@router.get("/summary/financial", response_model=TransactionSummary)
def get_financial_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TransactionSummary:
    transactions = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .all()
    )

    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")

    return TransactionSummary(
        income=round(total_income, 2),
        expense=round(total_expense, 2),
        balance=round(total_income - total_expense, 2),
        total_transactions=len(transactions),
    )
