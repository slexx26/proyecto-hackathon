# 19. API Endpoints — Contrato REST

**Responsable:** José  
**Apoya: Slater e Isaac validan entradas/salidas**  
**Prioridad: P0**

## Qué hace

Define recursos, métodos, payloads y respuestas para health, products, recommendations, AI y adaptations.

## Entregable

Endpoints FastAPI, esquemas Pydantic, códigos HTTP, ejemplos y contrato estable en docs/api.md.

## Integración

Es el acuerdo compartido: si cambia un esquema, frontend e IA deben actualizarse en el mismo PR o en PRs coordinados.

## Estado

**Completo.**

`docs/api-contract.md` más los tres routers reales: `backend/routers/products.py`, `providers.py`, `recommendations.py`, conectados en `main.py`. Probados con `TestClient` y un Supabase simulado (21 pruebas), y en vivo contra el proyecto real de Supabase (base vacía: `[]`, `404` en producto inexistente, `200` en recomendaciones con perfil vacío).
