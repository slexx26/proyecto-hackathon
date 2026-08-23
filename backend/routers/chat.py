"""POST /chat.

Asistente de apoyo, deliberadamente pequeño (sección 17, P1): aclara dudas
sobre cierres, posturas y adaptaciones, o encuentra una prenda concreta en
el catálogo y dice quién la vende. No calcula compatibilidad ni sustituye
al motor determinista — si preguntan por eso, remite a Find My Fit.

Sin `OPENAI_API_KEY`, o si la llamada falla, cae a las mismas respuestas
por palabra clave que ya corren en el frontend cuando `VITE_USE_MOCK_API`
está activo. Nunca revienta: peor es caro, no caído.
"""

import re
import unicodedata
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from postgrest.exceptions import APIError
from supabase import Client

from config import Settings, get_settings
from schemas.chat import ChatMessage, ChatRequest, ChatResponse
from services.supabase import get_supabase

from .products import SELECT_WITH_NEEDS, _row_to_product
from .providers import _row_to_provider

router = APIRouter(tags=["chat"])

_TIMEOUT_SECONDS = 8.0

_SYSTEM_PROMPT = (
    "Sos el asistente de ADAPTA, un directorio de moda y vida accesible. "
    "Respondé en español, en 2-3 frases, sobre cierres, posturas al "
    "vestirse, sensibilidad y adaptaciones posibles. NUNCA dés consejo "
    "médico, nunca diagnostiques a la persona, y nunca inventes un "
    "puntaje de compatibilidad: eso lo calcula el motor determinista, "
    "no vos. Si te preguntan por compatibilidad, remitilos a Find My Fit."
)


def _normalize(text: str) -> str:
    decomposed = unicodedata.normalize("NFD", text)
    without_accents = "".join(c for c in decomposed if unicodedata.category(c) != "Mn")
    return without_accents.lower()


def _find_product_by_name(message: str, products: list[dict]) -> dict | None:
    words = [w for w in re.findall(r"[a-z0-9]+", _normalize(message)) if len(w) > 2]
    if not words:
        return None

    best: tuple[dict, int] | None = None
    for row in products:
        haystack = _normalize(f"{row['name']} {row['brand']} {row['description']}")
        score = sum(1 for word in words if word in haystack)
        if score > 0 and (best is None or score > best[1]):
            best = (row, score)

    return best[0] if best and best[1] >= 2 else None


def _template_reply(message: str, products: list[dict], providers_by_id: dict) -> ChatMessage:
    """Respaldo determinista, sin OpenAI. Mismo criterio que el mock del
    frontend: buscar la prenda por nombre antes que responder genérico."""
    matched = _find_product_by_name(message, products)

    if matched:
        provider = providers_by_id.get(matched["provider_id"])
        provider_name = provider["name"] if provider else "un negocio del directorio"
        location = f" ({provider['location']})" if provider and provider.get("location") else ""
        content = f'Sí, tenemos "{matched["name"]}". Lo vende {provider_name}{location}.'
        return ChatMessage(
            id=f"srv-{datetime.now(UTC).timestamp()}",
            role="assistant",
            content=content,
            created_at=datetime.now(UTC).isoformat(),
            product_id=matched["id"],
            product_name=matched["name"],
        )

    asked = _normalize(message)
    if "iman" in asked or "magnet" in asked:
        content = (
            "Los cierres magnéticos se abrochan con una mano y sin pinza fina. "
            "Si usás marcapasos o desfibrilador, consultalo con tu equipo de "
            "salud antes."
        )
    elif "adapt" in asked:
        content = (
            "Casi cualquier prenda se puede adaptar. Las más sencillas son "
            "añadir una argolla al cierre o quitar etiquetas; abrir una "
            "costura lateral ya es trabajo de taller."
        )
    else:
        content = (
            "Puedo ayudarte con cierres, posturas y adaptaciones, o buscarte "
            "una prenda concreta si me decís el nombre. Contame qué necesitás."
        )

    return ChatMessage(
        id=f"srv-{datetime.now(UTC).timestamp()}",
        role="assistant",
        content=content,
        created_at=datetime.now(UTC).isoformat(),
    )


def _via_openai(
    request: ChatRequest,
    products: list[dict],
    providers_by_id: dict,
    api_key: str,
) -> ChatMessage | None:
    try:
        from openai import OpenAI
    except ImportError:
        return None

    catalog_hint = "\n".join(
        f"- {row['name']} ({row['brand']}), vendido por "
        f"{providers_by_id.get(row['provider_id'], {}).get('name', '?')}"
        for row in products[:20]
    )

    messages = [{"role": "system", "content": f"{_SYSTEM_PROMPT}\n\nCatálogo:\n{catalog_hint}"}]
    for item in request.history[-6:]:
        role = "assistant" if item.role == "assistant" else "user"
        messages.append({"role": role, "content": item.content})
    messages.append({"role": "user", "content": request.message})

    try:
        client = OpenAI(api_key=api_key, timeout=_TIMEOUT_SECONDS)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=180,
            timeout=_TIMEOUT_SECONDS,
        )
        text = response.choices[0].message.content
        if not text:
            return None
    except Exception:
        # Cualquier falla de red, timeout o cuota: cae a la plantilla.
        return None

    matched = _find_product_by_name(request.message, products)
    return ChatMessage(
        id=f"srv-{datetime.now(UTC).timestamp()}",
        role="assistant",
        content=text.strip(),
        created_at=datetime.now(UTC).isoformat(),
        product_id=matched["id"] if matched else None,
        product_name=matched["name"] if matched else None,
    )


@router.post("/chat", response_model=ChatResponse)
def send_message(
    request: ChatRequest,
    client: Client = Depends(get_supabase),
    settings: Settings = Depends(get_settings),
) -> ChatResponse:
    try:
        products_response = client.table("products").select(SELECT_WITH_NEEDS).execute()
        providers_response = client.table("providers").select("*").execute()
    except APIError as error:
        raise HTTPException(
            status_code=502, detail="No se pudo leer el catálogo."
        ) from error

    products = products_response.data
    providers_by_id = {row["id"]: row for row in providers_response.data}

    reply = None
    if settings.openai_api_key:
        reply = _via_openai(request, products, providers_by_id, settings.openai_api_key)

    if reply is None:
        reply = _template_reply(request.message, products, providers_by_id)

    return ChatResponse(reply=reply)
