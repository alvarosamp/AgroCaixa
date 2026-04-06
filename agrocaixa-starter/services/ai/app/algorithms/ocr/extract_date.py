import re
from datetime import date, datetime
from typing import Optional


def extrair_data(texto: str) -> Optional[date]:
    if not texto:
        return None

    match = re.search(r"(\d{2}/\d{2}/\d{4})", texto)
    if not match:
        return None

    try:
        return datetime.strptime(match.group(1), "%d/%m/%Y").date()
    except ValueError:
        return None
