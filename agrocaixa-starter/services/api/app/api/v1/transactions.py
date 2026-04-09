from typing import List

from fastapi import APIRouter, HTTPException

from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
    TransactionSummary,
)

router = APIRouter(prefix="/transactions", tags=["transactions"])

fake_db: List[TransactionResponse] = []


@router.post("/", response_model=TransactionResponse, status_code=201)
def create_transaction(transaction: TransactionCreate) -> TransactionResponse:
    new_transaction = TransactionResponse(
        id=len(fake_db) + 1,
        **transaction.model_dump()
    )
    fake_db.append(new_transaction)
    return new_transaction


@router.get("/", response_model=List[TransactionResponse])
def list_transactions() -> List[TransactionResponse]:
    return fake_db


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int) -> TransactionResponse:
    for transaction in fake_db:
        if transaction.id == transaction_id:
            return transaction
    raise HTTPException(status_code=404, detail="Transação não encontrada")


@router.get("/summary/financial", response_model=TransactionSummary)
def get_financial_summary() -> TransactionSummary:
    total_income = sum(t.amount for t in fake_db if t.type == "income")
    total_expense = sum(t.amount for t in fake_db if t.type == "expense")

    return TransactionSummary(
        income=round(total_income, 2),
        expense=round(total_expense, 2),
        balance=round(total_income - total_expense, 2),
        total_transactions=len(fake_db),
    )
