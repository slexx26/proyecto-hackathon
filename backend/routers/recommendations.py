"""POST /recommendations.

Junta tres piezas que hasta acá vivían separadas: el catálogo de la base,
el motor determinista de Isaac (`backend/recommendations/`) y el directorio
de proveedores. El score sale del motor tal cual; este router no lo toca,
solo lo transporta.
"""

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from postgrest.exceptions import APIError
from supabase import Client

from config import Settings, get_settings
from recommendations.adaptations import build_adaptations
from recommendations.engine import score_products
from recommendations.explanation import explain
from recommendations.models import ProductInput, ProfileInput
from schemas.recommendation import (
    AdaptationSuggestion,
    MatchReason,
    Recommendation,
    RecommendationsRequest,
    RecommendationsResponse,
)
from services.supabase import get_supabase

from .products import SELECT_WITH_NEEDS, _row_to_product
from .providers import _row_to_provider

router = APIRouter(tags=["recommendations"])


def _to_profile_input(request: RecommendationsRequest) -> ProfileInput:
    profile = request.profile
    return ProfileInput(
        needs=tuple(profile.needs),
        hand_dexterity=profile.hand_dexterity,
        dressing_posture=profile.dressing_posture,
        dressing_assistance=profile.dressing_assistance,
        sensory_sensitivity=profile.sensory_sensitivity,
        preferred_categories=tuple(profile.preferred_categories),
        notes=profile.notes,
    )


@router.post("/recommendations", response_model=RecommendationsResponse)
def create_recommendations(
    request: RecommendationsRequest,
    client: Client = Depends(get_supabase),
    settings: Settings = Depends(get_settings),
) -> RecommendationsResponse:
    try:
        products_response = client.table("products").select(SELECT_WITH_NEEDS).execute()
        providers_response = client.table("providers").select("*").execute()
    except APIError as error:
        raise HTTPException(
            status_code=502, detail="No se pudo leer el catálogo."
        ) from error

    products = [_row_to_product(row) for row in products_response.data]
    providers_by_id = {
        row["id"]: _row_to_provider(row) for row in providers_response.data
    }

    engine_inputs = [
        ProductInput(
            id=product.id,
            category=product.category,
            closure_type=product.closure_type,
            adaptation_needs=tuple(product.adaptation_needs),
        )
        for product in products
        # Un producto sin proveedor no puede recomendarse: el recorrido
        # termina en "dónde conseguirlo" (regla 8 de CLAUDE.md).
        if product.provider_id in providers_by_id
    ]

    scored = score_products(_to_profile_input(request), engine_inputs)
    products_by_id = {product.id: product for product in products}

    recommendations: list[Recommendation] = []
    for item in scored:
        product = products_by_id[item.product_id]
        provider = providers_by_id[product.provider_id]

        reasons = [
            MatchReason(
                need=r.need, status=r.status, weight=r.weight, label=r.label
            )
            for r in item.reasons
        ]
        adaptations = [
            AdaptationSuggestion(
                id=a.id,
                title=a.title,
                description=a.description,
                benefit=a.benefit,
                limitation=a.limitation,
                effort=a.effort,
            )
            for a in build_adaptations(item.reasons)
        ]

        # Si OpenAI falla, `explain` ya cae a la plantilla: nunca lanza.
        explanation = explain(
            product.name, item.score, item.reasons, settings.openai_api_key
        )

        recommendations.append(
            Recommendation(
                product=product,
                provider=provider,
                score=item.score,
                reasons=reasons,
                explanation=explanation,
                adaptations=adaptations,
            )
        )

    return RecommendationsResponse(
        recommendations=recommendations,
        generated_at=datetime.now(UTC).isoformat(),
    )
