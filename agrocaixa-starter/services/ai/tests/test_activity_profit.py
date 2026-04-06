from app.algorithms.finance.activity_profit import resultado_por_atividade


def test_resultado_por_atividade():
    transacoes = [
        {"type": "income", "amount": 2000, "activity_name": "morango"},
        {"type": "expense", "amount": 500, "activity_name": "morango"},
        {"type": "expense", "amount": 300, "activity_name": "cafe"},
    ]

    resultado = resultado_por_atividade(transacoes)

    assert resultado["morango"]["income"] == 2000.0
    assert resultado["morango"]["expense"] == 500.0
    assert resultado["morango"]["profit"] == 1500.0

    assert resultado["cafe"]["income"] == 0.0
    assert resultado["cafe"]["expense"] == 300.0
    assert resultado["cafe"]["profit"] == -300.0
