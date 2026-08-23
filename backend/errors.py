"""Manejo de errores centralizado (sección 24).

Regla: nunca se devuelve una traza de Python ni un nombre de tabla al
cliente. Los errores esperados (404, 422, 429, 503) ya salen bien formados
porque cada router los lanza como `HTTPException` y FastAPI los maneja
solo. Esto de acá es la red de seguridad para lo que nadie previó: si algo
revienta sin que ningún router lo haya anticipado, cae acá en vez de
mostrarle a la persona una traza de Python.
"""

import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger("adapta")


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        logger.exception(
            "Error no manejado en %s %s", request.method, request.url.path
        )
        return JSONResponse(
            status_code=500,
            content={"detail": "Error interno. Ya quedó registrado."},
        )
