"""Cliente de Supabase. Único punto del backend que abre la conexión.

Ningún router importa `supabase` directamente: todos pasan por acá, para
que la configuración (URL, clave) viva en un solo lugar.
"""

from functools import lru_cache

from fastapi import HTTPException
from supabase import Client, create_client

from config import get_settings


@lru_cache
def get_supabase() -> Client:
    settings = get_settings()
    if not settings.supabase_configured:
        # Sin credenciales el proceso igual tiene que poder arrancar
        # (para que /health funcione en cualquier máquina limpia). El error
        # sale recién cuando algo intenta usar la base de verdad.
        raise HTTPException(
            status_code=503,
            detail="La base de datos no está configurada en este servidor.",
        )
    return create_client(settings.supabase_url, settings.supabase_anon_key)
