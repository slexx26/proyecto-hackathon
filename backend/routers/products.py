"""GET /products, GET /products/{id}.

El frontend espera `adaptationNeeds` DENTRO del producto (ver
`frontend/src/types/product.ts`), así que armamos ese join acá: la tabla
`product_adaptation_needs` es un detalle de la base, no del contrato.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from postgrest.exceptions import APIError
from supabase import Client

from schemas.common import AdaptationNeed, ProductCategory
from schemas.product import Product, ProductImage
from services.supabase import get_supabase

router = APIRouter(tags=["products"])


def _row_to_product(row: dict) -> Product:
    needs = [
        item["need"]
        for item in row.get("product_adaptation_needs", [])
        # Supabase puede devolver la relación como lista de dicts o de None
        # si el join no encontró nada: cubrimos los dos casos.
        if item and "need" in item
    ]
    images = [ProductImage(**image) for image in (row.get("images") or [])]

    return Product(
        id=row["id"],
        provider_id=row["provider_id"],
        name=row["name"],
        brand=row["brand"],
        category=row["category"],
        price=row["price"],
        currency=row.get("currency", "CRC"),
        description=row["description"],
        images=images,
        adaptation_needs=needs,
        closure_type=row.get("closure_type", "none"),
        materials=row.get("materials") or [],
        limitations=row.get("limitations") or [],
        sizes=row.get("sizes") or [],
        in_stock=row.get("in_stock", True),
    )


SELECT_WITH_NEEDS = "*, product_adaptation_needs(need)"


@router.get("/products", response_model=list[Product])
def list_products(
    search: str | None = Query(default=None),
    category: ProductCategory | None = Query(default=None),
    adaptation_need: AdaptationNeed | None = Query(default=None),
    provider_id: str | None = Query(default=None),
    client: Client = Depends(get_supabase),
) -> list[Product]:
    try:
        query = client.table("products").select(SELECT_WITH_NEEDS)

        if category:
            query = query.eq("category", category)
        if provider_id:
            query = query.eq("provider_id", provider_id)
        if search:
            # Busca en nombre y marca. `ilike` es case-insensitive en Postgres.
            query = query.or_(f"name.ilike.%{search}%,brand.ilike.%{search}%")

        response = query.execute()
    except APIError as error:
        raise HTTPException(status_code=502, detail="No se pudo leer el catálogo.") from error

    products = [_row_to_product(row) for row in response.data]

    if adaptation_need:
        # Filtrar en Python: filtrar por un valor DENTRO de la tabla
        # relacionada desde PostgREST es más frágil que traer y filtrar acá,
        # y el catálogo de demo es chico.
        products = [p for p in products if adaptation_need in p.adaptation_needs]

    return products


@router.get("/products/{product_id}", response_model=Product)
def get_product(
    product_id: str,
    client: Client = Depends(get_supabase),
) -> Product:
    try:
        response = (
            client.table("products")
            .select(SELECT_WITH_NEEDS)
            .eq("id", product_id)
            .limit(1)
            .execute()
        )
    except APIError as error:
        raise HTTPException(status_code=502, detail="No se pudo leer el producto.") from error

    if not response.data:
        raise HTTPException(status_code=404, detail="El producto no existe.")

    return _row_to_product(response.data[0])
