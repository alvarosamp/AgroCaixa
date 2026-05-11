import os

import httpx
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.api.v1.activities import router as activities_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.auth import router as auth_router
from app.api.v1.categories import router as categories_router
from app.api.v1.farms import router as farms_router
from app.api.v1.reports import router as reports_router
from app.api.v1.transactions import router as transactions_router

app = FastAPI(
    title="AgroCaixa API",
    version="0.2.0",
    description="Backend principal do SaaS AgroCaixa.",
)

cors_origins_env = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:3001",
)
cors_origins = [
    origin.strip() for origin in cors_origins_env.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthResponse(BaseModel):
    status: str
    service: str


class AIExtractRequest(BaseModel):
    text: str


class AIClassifyRequest(BaseModel):
    description: str


def get_ai_service_url() -> str:
    return os.getenv("AI_SERVICE_URL", "http://localhost:8001").rstrip("/")


@app.get("/health", response_model=HealthResponse)
def healthcheck() -> HealthResponse:
    return HealthResponse(status="ok", service="api")


@app.get("/")
def root() -> dict:
    return {"message": "AgroCaixa API online"}


@app.post("/ai/extract")
async def extract_with_ai(payload: AIExtractRequest) -> dict:
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                f"{get_ai_service_url()}/extract",
                json={"text": payload.text},
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="O serviço de IA respondeu com erro ao extrair dados",
            ) from exc
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Não foi possível se conectar ao serviço de IA",
            ) from exc


@app.post("/ai/classify")
async def classify_with_ai(payload: AIClassifyRequest) -> dict:
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                f"{get_ai_service_url()}/classify-smart",
                json={"description": payload.description},
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="O serviço de IA respondeu com erro ao classificar a despesa",
            ) from exc
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Não foi possível se conectar ao serviço de IA",
            ) from exc


app.include_router(farms_router)
app.include_router(activities_router)
app.include_router(transactions_router)
app.include_router(categories_router)
app.include_router(reports_router)
app.include_router(alerts_router)
app.include_router(auth_router)
