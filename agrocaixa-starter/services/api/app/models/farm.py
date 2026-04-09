from typing import Optional

from pydantic import BaseModel


class Farm(BaseModel):
    id: Optional[int] = None
    name: str  # Nome da fazenda
    city: str  # Cidade onde a fazenda está localizada
    state: str  # Estado onde a fazenda está localizada
    production_type: str  # Tipo de produção (ex: agricultura, pecuária, etc.)
