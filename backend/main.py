"""ADAPTA — API.

Punto de partida escrito por Slater para que José no arranque de cero.
Es tuyo: cambialo. Lo único que no se negocia en silencio son las formas
del contrato (`docs/api-contract.md`), porque el frontend ya las consume.

Levantar:
    pip install -r requirements.txt
    cp .env.example .env
    uvicorn main:app --reload
    # http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from errors import register_error_handlers
from routers import chat, health, products, providers, recommendations

settings = get_settings()

app = FastAPI(
    title="ADAPTA API",
    version=settings.app_version,
    description=(
        "Directorio de productos y negocios de moda y vida accesible. "
        "El score de compatibilidad se calcula acá con reglas deterministas; "
        "OpenAI solo lo explica."
    ),
)

# CORS restringido al frontend. Nunca "*": este backend va a hablar con
# OpenAI y con Supabase, y no queremos que cualquier origen lo use de puente.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

register_error_handlers(app)

API_PREFIX = "/api/v1"

app.include_router(health.router, prefix=API_PREFIX)
app.include_router(products.router, prefix=API_PREFIX)
app.include_router(providers.router, prefix=API_PREFIX)
app.include_router(recommendations.router, prefix=API_PREFIX)
app.include_router(chat.router, prefix=API_PREFIX)
