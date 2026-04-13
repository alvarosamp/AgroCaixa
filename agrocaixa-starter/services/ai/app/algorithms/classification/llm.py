import os
import requests
from app.algorithms.classification.rules import categorizar_despesa_por_regra

ALLOWED_CATEGORIES = {
    "insumos",
    "combustivel",
    "manutencao",
    "racao",
    "energia",
    "agua",
    "mao_de_obra",
    "outros",
}
def normalize_category(category: str) -> str:
    value = (category or "").strip().lower()
    value = value.replace("mão_de_obra", "mao_de_obra").replace("mão de obra", "mao_de_obra")
    value = value.replace("combustível", "combustivel").replace("manutenção", "manutencao")
    return value


def classify_category_llm(text: str) -> str:
    """
    Classifica usando Ollama local.
    Se a resposta vier inválida, faz fallback para regra.
    """
    if not text or not text.strip():
        return "outros"

    ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
    ollama_model = os.getenv("OLLAMA_MODEL", "llama3.1:8b")

    prompt = f"""
Você é um classificador de despesas de um SaaS financeiro rural.

Classifique a descrição abaixo em exatamente UMA das categorias:
- insumos
- combustivel
- manutencao
- racao
- energia
- agua
- mao_de_obra
- outros

Descrição:
{text}

Regras:
- Responda apenas com o nome da categoria.
- Não explique.
- Não use pontuação.
- Não invente categoria nova.
""".strip()

    try:
        response = requests.post(
            f"{ollama_url}/api/generate",
            json={
                "model": ollama_model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0
                }
            },
            timeout=60,
        )
        response.raise_for_status()

        data = response.json()
        raw_category = data.get("response", "").strip()
        category = normalize_category(raw_category)

        if category in ALLOWED_CATEGORIES:
            return category

        return classify_category_rule(text)

    except Exception:
        return classify_category_rule(text)


def classify_category_smart(text: str) -> str:
    """
    Estratégia principal:
    1. tenta LLM local
    2. fallback para regra
    """
    return classify_category_llm(text)
