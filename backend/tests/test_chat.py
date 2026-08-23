"""Pruebas de /chat con Supabase simulado y sin clave de OpenAI.

Sin OPENAI_API_KEY, el router tiene que caer solo a la plantilla y nunca
devolver 500. Estas pruebas corren en cualquier máquina, tenga o no clave
real: la ruta con OpenAI de verdad la probé a mano contra el proyecto real
(ver mensaje de commit), no depende de esto para pasar en CI.
"""

from fastapi.testclient import TestClient

from config import Settings, get_settings
from main import app
from services.supabase import get_supabase
from tests.test_routers import FakeSupabase, PRODUCT_ROW, PROVIDER_ROW


def _client():
    fake = FakeSupabase({"products": [PRODUCT_ROW], "providers": [PROVIDER_ROW]})
    app.dependency_overrides[get_supabase] = lambda: fake
    app.dependency_overrides[get_settings] = lambda: Settings(openai_api_key="")
    return TestClient(app)


def teardown_function():
    app.dependency_overrides.clear()


def test_sin_clave_cae_a_la_plantilla_y_no_falla():
    client = _client()
    response = client.post(
        "/api/v1/chat",
        json={"message": "hola", "history": []},
    )

    assert response.status_code == 200
    assert isinstance(response.json()["reply"]["content"], str)


def test_encuentra_el_producto_por_nombre_sin_openai():
    client = _client()
    response = client.post(
        "/api/v1/chat",
        json={"message": "quiero la Camisa Vera de cierre magnético", "history": []},
    )

    reply = response.json()["reply"]
    assert reply["productId"] == "adp-001"
    assert reply["productName"] == PRODUCT_ROW["name"]


def test_pregunta_generica_no_engancha_un_producto():
    client = _client()
    response = client.post(
        "/api/v1/chat",
        json={"message": "los cierres magnéticos son seguros?", "history": []},
    )

    reply = response.json()["reply"]
    assert reply["productId"] is None
