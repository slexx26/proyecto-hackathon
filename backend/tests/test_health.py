from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_responde_ok():
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_cors_no_es_comodin():
    """Regla de seguridad: el backend no acepta cualquier origen."""
    response = client.get(
        "/api/v1/health",
        headers={"Origin": "https://sitio-que-no-es-nuestro.test"},
    )

    assert response.headers.get("access-control-allow-origin") != "*"
