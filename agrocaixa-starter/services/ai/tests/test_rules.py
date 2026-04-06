from app.algorithms.classification.rules import categorizar_despesa_por_regra


def test_categorizar_combustivel():
    texto = "Pagamento no posto avenida - diesel comum"
    assert categorizar_despesa_por_regra(texto) == "combustivel"


def test_categorizar_insumos():
    texto = "Compra de adubo e fertilizante para plantio"
    assert categorizar_despesa_por_regra(texto) == "insumos"


def test_categorizar_outros():
    texto = "Despesa diversa sem padrão conhecido"
    assert categorizar_despesa_por_regra(texto) == "outros"
