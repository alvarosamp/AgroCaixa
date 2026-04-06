from app.algorithms.finance.monthly_summary import resumo_mensal


def test_resumo_mensal():
    transacoes = [
        {"type": "income", "amount": 1500},
        {"type": "expense", "amount": 200},
        {"type": "expense", "amount": 100},
    ]

    resultado = resumo_mensal(transacoes)

    assert resultado["total_entradas"] == 1500.0
    assert resultado["total_saidas"] == 300.0
    assert resultado["saldo"] == 1200.0
    assert resultado["qtd_transacoes"] == 3
