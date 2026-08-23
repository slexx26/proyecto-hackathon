"""Pruebas de integración de los routers, con Supabase simulado.

La base real está vacía mientras nadie corra `seed.sql` (o mientras nadie
tenga la clave `service_role`/`DATABASE_URL`: la anon key deja leer pero no
escribir, por RLS — así debe ser). Estas pruebas no dependen de eso: arman
las filas que Supabase devolvería y verifican que el router las traduce
bien al contrato que el frontend espera, incluido el join de necesidades y
el paso por el motor de Isaac.
"""

from unittest.mock import MagicMock

from fastapi.testclient import TestClient

from main import app
from services.supabase import get_supabase

PROVIDER_ROW = {
    "id": "prv-001",
    "name": "Vera Studio",
    "kind": "adaptive-apparel",
    "description": "Taller de confección.",
    "location": "San José, Costa Rica",
    "ships_nationwide": True,
    "contact_website": "https://ejemplo.test/vera",
    "contact_phone": None,
    "contact_email": None,
    "plan": "featured",
    "verified": True,
}

PROVIDER_FREE_ROW = {
    **PROVIDER_ROW,
    "id": "prv-002",
    "name": "Ártico",
    "plan": "free",
    "verified": False,
}

PRODUCT_ROW = {
    "id": "adp-001",
    "provider_id": "prv-001",
    "name": "Camisa Vera de cierre magnético",
    "brand": "Vera Studio",
    "category": "tops",
    "price": 42000,
    "currency": "CRC",
    "description": "Camisa con cierre magnético oculto.",
    "images": [{"url": "/x.svg", "alt": "Camisa celeste"}],
    "closure_type": "magnetic",
    "materials": ["Algodón"],
    "limitations": [],
    "sizes": ["M"],
    "in_stock": True,
    "product_adaptation_needs": [
        {"need": "one-handed-dressing"},
        {"need": "no-fine-motor"},
    ],
}

PRODUCT_NO_PROVIDER_ROW = {
    **PRODUCT_ROW,
    "id": "adp-huerfano",
    "provider_id": "prv-inexistente",
}


class FakeQuery:
    """Encadena `.select().eq().execute()` como el cliente real, pero
    devuelve las filas que le pasemos."""

    def __init__(self, rows: list[dict]):
        self._rows = rows

    def select(self, *_args, **_kwargs):
        return self

    def eq(self, field, value):
        self._rows = [r for r in self._rows if r.get(field) == value]
        return self

    def or_(self, *_args, **_kwargs):
        return self

    def limit(self, *_args, **_kwargs):
        return self

    def insert(self, payload):
        self._inserted = payload
        return self

    def execute(self):
        response = MagicMock()
        response.data = self._rows
        return response


class FakeSupabase:
    def __init__(self, tables: dict[str, list[dict]]):
        self._tables = tables

    def table(self, name: str):
        return FakeQuery(list(self._tables.get(name, [])))


def _client(app_client=None, **tables):
    fake = FakeSupabase(tables)
    app.dependency_overrides[get_supabase] = lambda: fake
    return TestClient(app)


def teardown_function():
    app.dependency_overrides.clear()


def test_products_arma_adaptation_needs_desde_el_join():
    client = _client(products=[PRODUCT_ROW])
    response = client.get("/api/v1/products")

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert set(body[0]["adaptationNeeds"]) == {"one-handed-dressing", "no-fine-motor"}
    assert body[0]["providerId"] == "prv-001"


def test_product_inexistente_da_404():
    client = _client(products=[])
    response = client.get("/api/v1/products/no-existe")

    assert response.status_code == 404
    assert "detail" in response.json()


def test_providers_ordena_featured_antes_que_free():
    client = _client(providers=[PROVIDER_FREE_ROW, PROVIDER_ROW])
    response = client.get("/api/v1/providers")

    assert response.status_code == 200
    body = response.json()
    assert [item["id"] for item in body] == ["prv-001", "prv-002"]


def test_provider_application_devuelve_received_true():
    client = _client()
    response = client.post(
        "/api/v1/providers/applications",
        json={
            "businessName": "Taller Nuevo",
            "kind": "adaptation-workshop",
            "location": "Cartago",
            "email": "hola@tallernuevo.cr",
            "description": "Adaptamos ropa que ya tenés, con imanes y velcro.",
        },
    )

    assert response.status_code == 201
    assert response.json() == {"received": True}


def test_recommendations_incrusta_el_proveedor_y_usa_el_motor():
    client = _client(products=[PRODUCT_ROW], providers=[PROVIDER_ROW])
    response = client.post(
        "/api/v1/recommendations",
        json={"profile": {"needs": ["one-handed-dressing"], "handDexterity": "one-hand"}},
    )

    assert response.status_code == 200
    body = response.json()
    assert len(body["recommendations"]) == 1

    item = body["recommendations"][0]
    assert item["provider"]["id"] == "prv-001"
    assert 0 <= item["score"] <= 100
    assert any(r["status"] == "match" for r in item["reasons"])
    # Explicación siempre presente: sin OPENAI_API_KEY cae a la plantilla,
    # nunca es None por defecto en este entorno de pruebas.
    assert isinstance(item["explanation"], str)


def test_recommendations_ignora_productos_sin_proveedor():
    """Regla 8 de CLAUDE.md: sin proveedor, sin recomendación."""
    client = _client(
        products=[PRODUCT_ROW, PRODUCT_NO_PROVIDER_ROW],
        providers=[PROVIDER_ROW],
    )
    response = client.post("/api/v1/recommendations", json={"profile": {}})

    ids = [item["product"]["id"] for item in response.json()["recommendations"]]
    assert "adp-huerfano" not in ids
    assert "adp-001" in ids
