"""Límite de peticiones muy simple para endpoints públicos sin autenticación.

En memoria: alcanza para la demo de un hackathon corriendo en una sola
instancia. Si el backend se llegara a desplegar con más de un worker, esto
no comparte estado entre procesos — para eso haría falta Redis, y eso es
más infraestructura de la que corresponde a un proyecto de 48 horas.
"""

import time
from collections import defaultdict

from fastapi import HTTPException

_WINDOW_SECONDS = 60
_MAX_REQUESTS = 5

_hits: dict[str, list[float]] = defaultdict(list)


def enforce_rate_limit(identifier: str) -> None:
    now = time.monotonic()
    window_start = now - _WINDOW_SECONDS

    recent = [t for t in _hits[identifier] if t > window_start]
    recent.append(now)
    _hits[identifier] = recent

    if len(recent) > _MAX_REQUESTS:
        raise HTTPException(
            status_code=429,
            detail="Demasiadas solicitudes. Probá de nuevo en un minuto.",
        )
