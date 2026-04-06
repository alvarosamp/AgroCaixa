from typing import Iterable, Mapping


def calcular_saldo(transacoes: Iterable[Mapping]) -> float:
    saldo = 0.0

    for transacao in transacoes:
        tipo = str(transacao.get("type", "")).strip().lower()
        valor = float(transacao.get("amount", 0.0) or 0.0)

        if tipo == "income":
            saldo += valor
        elif tipo == "expense":
            saldo -= valor

    return round(saldo, 2)
