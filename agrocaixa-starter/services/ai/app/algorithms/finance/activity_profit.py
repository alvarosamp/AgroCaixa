from collections import defaultdict
from typing import Iterable, Mapping


def resultado_por_atividade(transacoes: Iterable[Mapping]) -> dict:
    """
    Calcula resultado financeiro por atividade.

    Cada atividade terá:
    - income
    - expense
    - profit

    Exemplo de transação:
    {
        "type": "expense",
        "amount": 120.0,
        "activity_name": "morango"
    }
    """
    resultado = defaultdict(lambda: {"income": 0.0, "expense": 0.0, "profit": 0.0})

    for transacao in transacoes:
        atividade = str(transacao.get("activity_name", "sem_atividade")).strip() or "sem_atividade"
        tipo = str(transacao.get("type", "")).strip().lower()
        valor = float(transacao.get("amount", 0.0) or 0.0)

        if tipo == "income":
            resultado[atividade]["income"] += valor
        elif tipo == "expense":
            resultado[atividade]["expense"] += valor

    for atividade, dados in resultado.items():
        dados["profit"] = round(dados["income"] - dados["expense"], 2)
        dados["income"] = round(dados["income"], 2)
        dados["expense"] = round(dados["expense"], 2)

    return dict(resultado)
