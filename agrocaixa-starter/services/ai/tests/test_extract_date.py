from app.algorithms.ocr.extract_date import extrair_data


def test_extrair_data_valida():
    texto = "Data da compra: 24/03/2026"
    resultado = extrair_data(texto)

    assert resultado is not None
    assert resultado.day == 24
    assert resultado.month == 3
    assert resultado.year == 2026


def test_extrair_data_inexistente():
    texto = "Sem data no documento"
    assert extrair_data(texto) is None
