from typing import List

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db_models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.db import SessionLocal

router = APIRouter(prefix="/transactions", tags=["transactions"])

# Função para obter a sessão de banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=TransactionResponse | List[TransactionResponse], status_code=201)
def create_transaction(
    transaction: TransactionCreate | List[TransactionCreate],
    db: Session = Depends(get_db),
) -> TransactionResponse | List[TransactionResponse]:
    if isinstance(transaction, list):
        if not transaction:
            return []

        db_transactions = [
            Transaction(
                type=item.type,
                amount=item.amount,
                date=item.date,
                description=item.description,
                activity_name=item.activity_name,
                category=item.category,
            )
            for item in transaction
        ]
        db.add_all(db_transactions)
        db.commit()
        for item in db_transactions:
            db.refresh(item)
        return db_transactions

    db_transaction = Transaction(
        type=transaction.type,
        amount=transaction.amount,
        date=transaction.date,
        description=transaction.description,
        activity_name=transaction.activity_name,
        category=transaction.category,
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


@router.get("/", response_model=List[TransactionResponse])
def list_transactions(db: Session = Depends(get_db)) -> List[TransactionResponse]:
    transactions = db.query(Transaction).all()
    return transactions


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)) -> TransactionResponse:
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    return transaction
