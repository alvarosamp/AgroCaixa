import re


def limpar_texto_ocr(texto: str) -> str:
    if not texto:
        return ""

    texto = texto.lower()
    texto = texto.replace("\n", " ")
    texto = re.sub(r"\s+", " ", texto)
    return texto.strip()
