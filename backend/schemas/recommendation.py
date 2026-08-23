"""Salida del motor determinista más la explicación de IA.

INVARIANTE: `score` lo calcula el motor de Isaac con reglas fijas. OpenAI
puede rellenar `explanation`, nunca tocar `score`.
"""

from typing import Literal

from pydantic import Field

from .common import AdaptationNeed
from .product import Product
from .provider import CamelModel, Provider


class FitProfile(CamelModel):
    """Perfil funcional. Describe cómo se viste la persona, no su diagnóstico."""

    needs: list[AdaptationNeed] = []
    dressing_assistance: Literal["independent", "partial-help", "full-help"] = (
        "independent"
    )
    hand_dexterity: Literal["both-hands", "one-hand", "limited-grip"] = "both-hands"
    dressing_posture: Literal["standing", "seated", "lying-down"] = "standing"
    sensory_sensitivity: Literal["none", "mild", "high"] = "none"
    preferred_categories: list[str] = []
    notes: str | None = Field(default=None, max_length=400)


class MatchReason(CamelModel):
    """Evidencia verificable. Es lo único que queda si OpenAI se cae."""

    need: AdaptationNeed
    status: Literal["match", "partial", "gap"]
    weight: int
    label: str


class AdaptationSuggestion(CamelModel):
    id: str
    title: str
    description: str
    benefit: str
    # Obligatoria: la interfaz la muestra con el mismo peso que el beneficio.
    limitation: str
    effort: Literal["low", "medium", "high"]


class Recommendation(CamelModel):
    product: Product
    # El recorrido termina en "dónde conseguirlo", no en "esto te sirve".
    provider: Provider
    score: int = Field(ge=0, le=100)
    reasons: list[MatchReason] = []
    # Opcional a propósito: si OpenAI falla, se omite y no se devuelve un 500.
    explanation: str | None = None
    adaptations: list[AdaptationSuggestion] = []


class RecommendationsRequest(CamelModel):
    profile: FitProfile


class RecommendationsResponse(CamelModel):
    recommendations: list[Recommendation] = []
    generated_at: str
