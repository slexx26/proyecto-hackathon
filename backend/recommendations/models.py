"""Tipos internos del motor.

Deliberadamente independientes de FastAPI y de Supabase: el motor tiene que
poder probarse sin levantar nada. Los schemas de la API viven en `schemas/`.
"""

from dataclasses import dataclass, field
from typing import Literal

from schemas.common import AdaptationNeed, ClosureType, ProductCategory

ReasonStatus = Literal["match", "partial", "gap"]


@dataclass(frozen=True)
class ProfileInput:
    """Lo que la persona respondió en Find My Fit."""

    needs: tuple[AdaptationNeed, ...] = ()
    hand_dexterity: str = "both-hands"
    dressing_posture: str = "standing"
    dressing_assistance: str = "independent"
    sensory_sensitivity: str = "none"
    preferred_categories: tuple[ProductCategory, ...] = ()
    notes: str | None = None


@dataclass(frozen=True)
class ProductInput:
    """Lo que la base de datos sabe del producto."""

    id: str
    category: ProductCategory
    closure_type: ClosureType
    adaptation_needs: tuple[AdaptationNeed, ...] = ()


@dataclass(frozen=True)
class Reason:
    """Evidencia verificable. Es lo único que queda si OpenAI se cae."""

    need: AdaptationNeed
    status: ReasonStatus
    weight: int
    label: str


@dataclass(frozen=True)
class Scored:
    product_id: str
    score: int
    reasons: list[Reason] = field(default_factory=list)
