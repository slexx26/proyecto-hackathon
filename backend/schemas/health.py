from .provider import CamelModel


class HealthStatus(CamelModel):
    status: str
    version: str | None = None
