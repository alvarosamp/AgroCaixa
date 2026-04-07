from typing import Iterable, Mapping


def resumo_mensal(transacoes: Iterable[Mapping]) -> dict:
    '''
    Retorna um resumo financeiro:
    - total_entradas
    - total_saidas
    - saldo
    - qtd_transacoes

    '''

    total_entradas = 0.0
    total_saidas = 0.0
    qtd_transacoes = 0

    for transacao in transacoes:
        tipo = str(transacao.get("type", "")).strip().lower()
        valor = float(transacao.get("amount", 0.0) or 0.0)

        if tipo == "income":
            total_entradas += valor
            qtd_transacoes += 1
        elif tipo == "expense":
            total_saidas += valor
            qtd_transacoes += 1

    saldo = total_entradas - total_saidas

    return {
        "total_entradas": round(total_entradas, 2),
        "total_saidas": round(total_saidas, 2),
        "saldo": round(saldo, 2),
        "qtd_transacoes": qtd_transacoes,
    }
