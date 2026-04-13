from fastapi import FastAPI
from pydantic import BaseModel

from app.algorithms.classification.llm import classify_category_llm, classify_category_smart
from app.algorithms.classification.rules import categorizar_despesa_por_regra as classify_category_rule
from app.algorithms.ocr.clean_text import limpar_texto_ocr
from app.algorithms.ocr.extract_amount import extrair_valor
from app.algorithms.ocr.extract_date import extrair_data

app = FastAPI(
    title="AgroCaixa AI Service",
    version="0.2.0",
    description="Serviço de IA para OCR, classificação e automações inteligentes."
)


class ExtractRequest(BaseModel):
    text: str


class ClassifyRequest(BaseModel):
    description: str


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
    categoria = classify_category_rule(texto_limpo)

    return {
        "original_text": payload.text,
        "clean_text": texto_limpo,
        "amount": valor,
        "date": data.isoformat() if data else None,
        "suggested_category": categoria,
    }


@app.post("/classify")
def classify_rule(payload: ClassifyRequest) -> dict:
    category = classify_category_rule(payload.description)
    return {
        "category": category,
        "strategy": "rule",
    }


@app.post("/classify-llm")
def classify_llm(payload: ClassifyRequest) -> dict:
    category = classify_category_llm(payload.description)
    return {
        "category": category,
        "strategy": "llm",
    }


@app.post("/classify-smart")
def classify_smart(payload: ClassifyRequest) -> dict:
    category = classify_category_smart(payload.description)
    return {
        "category": category,
        "strategy": "smart",
    }
