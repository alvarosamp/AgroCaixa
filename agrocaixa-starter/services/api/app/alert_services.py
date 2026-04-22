from datetime import datetime
from sqlachemy.orm import Session
from app.models.alert import AlertaFinancial
from app.models.transaction import Transaction

def gerar_alerta_financial(db: Session, user_id, id : int):
    #Calcular aumento ou diminuição do valor gasto em relação ao mês anterior
    transacoes_anteriores   = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.date >= datetime.now().replace(day = 1).month - 1
    ).all()

    transacoes_atuais = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.date >= datetime.now().replace(day = 1)
    ).all()

    despesas_mes_passado = sum(t.amount for t in transacoes_anteriores if t.type == 'expense')
    despesas_mes_atual = sum(t.amount for t in transacoes_atuais if t.type == 'expense')

    #Se houve aumento de mais de 20% em relação ao mes anterior
    if despesas_mes_atual > despesas_mes_passado * 1.2:
        alerta = AlertaFinancial(
            user_id=user_id,
            message=f"Você gastou {despesas_mes_atual - despesas_mes_passado:.2f} a mais este mês em comparação ao mês anterior.",
            date=datetime.now(),
            type='expensive'
        )
        db.add(alerta)
        db.commit()

    #Exemplo de alerta de queda
    renda_mes_passado = sum(t.amount for t in transacoes_anteriores if t.type == 'income')
    renda_mes_atual = sum(t.amount for t in transacoes_atuais if t  .type == 'income')

    if renda_mes_atual < renda_mes_passado * 0.8:
        alerta = AlertaFinancial(
            user_id=user_id,
            message=f"Você recebeu {renda_mes_passado - renda_mes_atual:.2f} a menos este mês em comparação ao mês anterior.",
            date=datetime.now(),
            type='income'
        )
        db.add(alerta)
        db.commit()

