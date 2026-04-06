from app.algorithms.ocr.extract_amount import extrair_valor


def test_extrair_valor_total():
    texto = "Total: R$ 120,50"
    assert extrair_valor(texto) == 120.50


def test_extrair_valor_generico():
    texto = "Pagamento realizado no valor de R$ 1.250,00"
    assert extrair_valor(texto) == 1250.00


def test_extrair_valor_inexistente():
    texto = "Documento sem valor monetario"
    assert extrair_valor(texto) is None
