from fastapi import APIRouter, Depends

from config import Settings, get_settings
from schemas.health import HealthStatus

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthStatus)
def health(settings: Settings = Depends(get_settings)) -> HealthStatus:
    return HealthStatus(status="ok", version=settings.app_version)
