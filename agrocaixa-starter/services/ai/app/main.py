from fastapi import FastAPI
from pydantic import BaseModel

from app.algorithms.classification.rules import categorizar_despesa_por_regra
from app.algorithms.ocr.clean_text import limpar_texto_ocr
from app.algorithms.ocr.extract_amount import extrair_valor
from app.algorithms.ocr.extract_date import extrair_data

app = FastAPI(
    title="AgroCaixa AI Service",
    version="0.1.0",
    description="Serviço de IA para OCR, classificação e algoritmos financeiros."
)


class ExtractRequest(BaseModel):
    text: str


@app.get("/health")
def healthcheck() -> dict:
    return {"status": "ok", "service": "ai"}


@app.get("/")
def root() -> dict:
    return {"message": "AgroCaixa AI Service online"}


@app.post("/extract")
def extract_data(payload: ExtractRequest) -> dict:
    texto_limpo = limpar_texto_ocr(payload.text)
    valor = extrair_valor(texto_limpo)
    data = extrair_data(texto_limpo)
    categoria = categorizar_despesa_por_regra(texto_limpo)

    return {
        "original_text": payload.text,
        "clean_text": texto_limpo,
        "amount": valor,
        "date": data.isoformat() if data else None,
        "suggested_category": categoria,
    }
