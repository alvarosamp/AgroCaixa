from pydantic import BaseModel
from typing import Optional

class Activity(BaseModel):
    id: Optional[int] = None
    farm_id: int  # Relacionamento com a fazenda
    name: str  # Nome da atividade (ex: plantio de morango)
    type: str  # Tipo de atividade (ex: plantio, colheita)
    status: str  # Status da atividade (ex: em andamento, finalizada)
