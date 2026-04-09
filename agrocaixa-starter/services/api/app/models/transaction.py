from sqlalchemy import Column, DateTime, Float, Integer, String
from app.db import Base


class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)  # 'income' ou 'expense'
    amount = Column(Float)
    date = Column(DateTime)
    description = Column(String, nullable=True)
    farm_id = Column(Integer, nullable=True)  # Relacionamento opcional com fazenda
    activity_id = Column(Integer, nullable=True)  # Relacionamento opcional com atividade
