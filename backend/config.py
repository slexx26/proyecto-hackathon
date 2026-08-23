"""Configuración leída del entorno.

Único lugar del backend que toca variables de entorno. Nada de os.getenv
esparcido por los routers.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_version: str = "0.1.0"

    # Vacías por defecto: la app arranca sin Supabase ni OpenAI para poder
    # levantar /health antes de tener credenciales.
    openai_api_key: str = ""
    supabase_url: str = ""
    supabase_anon_key: str = ""
    database_url: str = ""

    frontend_origin: str = "http://localhost:5173"

    @property
    def supabase_configured(self) -> bool:
        return bool(self.supabase_url and self.supabase_anon_key)


@lru_cache
def get_settings() -> Settings:
    return Settings()
