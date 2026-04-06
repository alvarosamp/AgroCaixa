from app.algorithms.finance.balance import calcular_saldo


def test_calcular_saldo():
    transacoes = [
        {"type": "income", "amount": 1000},
        {"type": "expense", "amount": 300},
        {"type": "expense", "amount": 100},
    ]

    assert calcular_saldo(transacoes) == 600.0
