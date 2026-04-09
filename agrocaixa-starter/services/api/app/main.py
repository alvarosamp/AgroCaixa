from fastapi import FastAPI
from pydantic import BaseModel
import httpx
import os

from app.api.v1.transactions import router as transactions_router
from app.api.v1.farms import router as farms_router
from app.api.v1.activities import router as activities_router
app = FastAPI(
    title="AgroCaixa API",
    version="0.2.0",
    description="Backend principal do SaaS AgroCaixa."
)


class HealthResponse(BaseModel):
    status: str
    service: str


class AIExtractRequest(BaseModel):
    text: str


@app.get("/health", response_model=HealthResponse)
def healthcheck() -> HealthResponse:
    return HealthResponse(status="ok", service="api")


@app.get("/")
def root() -> dict:
    return {"message": "AgroCaixa API online"}


@app.post("/ai/extract")
async def extract_with_ai(payload: AIExtractRequest) -> dict:
    ai_service_url = os.getenv("AI_SERVICE_URL", "http://localhost:8001")

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{ai_service_url}/extract",
            json={"text": payload.text},
        )
        response.raise_for_status()
        return response.json()


app.include_router(farms_router)
app.include_router(activities_router)
app.include_router(transactions_router)
