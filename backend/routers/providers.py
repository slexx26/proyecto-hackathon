"""GET /providers, GET /providers/{id}, POST /providers/applications.

El orden del directorio lo decide ESTE archivo, no el frontend: featured
primero, luego verified, luego free; alfabético dentro de cada grupo. Es lo
que el negocio compra al pagar la inscripción, así que no puede depender de
un `sort()` que cualquiera reescribe desde la consola del navegador.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from postgrest.exceptions import APIError
from supabase import Client

from schemas.common import ProviderKind
from schemas.provider import (
    Provider,
    ProviderApplication,
    ProviderApplicationReceipt,
    ProviderContact,
)
from services.supabase import get_supabase

router = APIRouter(tags=["providers"])

_PLAN_RANK = {"featured": 0, "verified": 1, "free": 2}


def _row_to_provider(row: dict) -> Provider:
    return Provider(
        id=row["id"],
        name=row["name"],
        kind=row["kind"],
        description=row["description"],
        location=row["location"],
        ships_nationwide=row.get("ships_nationwide", False),
        contact=ProviderContact(
            website=row.get("contact_website"),
            phone=row.get("contact_phone"),
            email=row.get("contact_email"),
        ),
        plan=row.get("plan", "free"),
        verified=row.get("verified", False),
    )


@router.get("/providers", response_model=list[Provider])
def list_providers(
    search: str | None = Query(default=None),
    kind: ProviderKind | None = Query(default=None),
    verified_only: bool = Query(default=False),
    client: Client = Depends(get_supabase),
) -> list[Provider]:
    try:
        query = client.table("providers").select("*")

        if kind:
            query = query.eq("kind", kind)
        if verified_only:
            query = query.eq("verified", True)
        if search:
            query = query.or_(
                f"name.ilike.%{search}%,description.ilike.%{search}%,location.ilike.%{search}%"
            )

        response = query.execute()
    except APIError as error:
        raise HTTPException(
            status_code=502, detail="No se pudo leer el directorio."
        ) from error

    providers = [_row_to_provider(row) for row in response.data]
    providers.sort(key=lambda p: (_PLAN_RANK.get(p.plan, 9), p.name))
    return providers


@router.get("/providers/{provider_id}", response_model=Provider)
def get_provider(
    provider_id: str,
    client: Client = Depends(get_supabase),
) -> Provider:
    try:
        response = (
            client.table("providers")
            .select("*")
            .eq("id", provider_id)
            .limit(1)
            .execute()
        )
    except APIError as error:
        raise HTTPException(status_code=502, detail="No se pudo leer el negocio.") from error

    if not response.data:
        raise HTTPException(status_code=404, detail="El negocio no existe.")

    return _row_to_provider(response.data[0])


@router.post(
    "/providers/applications",
    response_model=ProviderApplicationReceipt,
    status_code=201,
)
def submit_application(
    application: ProviderApplication,
    client: Client = Depends(get_supabase),
) -> ProviderApplicationReceipt:
    """Recibe la solicitud de inscripción. NO procesa ningún pago:
    el cobro se coordina fuera de la plataforma (sección 36)."""
    try:
        client.table("provider_applications").insert(
            {
                "business_name": application.business_name,
                "kind": application.kind,
                "location": application.location,
                "email": application.email,
                "description": application.description,
            }
        ).execute()
    except APIError as error:
        raise HTTPException(
            status_code=502, detail="No se pudo guardar la solicitud."
        ) from error

    return ProviderApplicationReceipt()
