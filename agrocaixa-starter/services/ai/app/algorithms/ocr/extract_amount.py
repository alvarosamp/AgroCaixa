import re
from typing import Optional


def extrair_valor(texto: str) -> Optional[float]:
    """
    Extrai valor monetário do texto OCR.

    Exemplos aceitos:
    - Total: R$ 120,50
    - Valor R$ 1.250,00
    - R$ 89,90
    """
    if not texto:
        return None

    padroes = [
        r"total\s*[:\-]?\s*r\$\s*(\d{1,3}(?:\.\d{3})*,\d{2})",
        r"valor\s*[:\-]?\s*r\$\s*(\d{1,3}(?:\.\d{3})*,\d{2})",
        r"r\$\s*(\d{1,3}(?:\.\d{3})*,\d{2})",
        r"(\d{1,3}(?:\.\d{3})*,\d{2})",
    ]

    texto = texto.lower()

    for padrao in padroes:
        match = re.search(padrao, texto, re.IGNORECASE)
        if match:
            valor_str = match.group(1)
            valor_str = valor_str.replace(".", "").replace(",", ".")
            try:
                return round(float(valor_str), 2)
            except ValueError:
                return None

    return None
