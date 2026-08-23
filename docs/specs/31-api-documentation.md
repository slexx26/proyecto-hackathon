# 31. API Documentation — Documentación API

**Responsable:** José  
**Apoya: Slater e Isaac aportan ejemplos reales**  
**Prioridad: P0**

## Qué hace

Describe cómo consumir cada endpoint, sus esquemas, ejemplos, errores y autenticación/configuración necesaria.

## Entregable

docs/api.md y OpenAPI/Swagger funcional generado por FastAPI.

## Integración

Es la fuente compartida para alinear frontend, motor e IA sin adivinar formatos.

## Estado

**Completo.**

`docs/api-contract.md` mas los routers reales generan `/docs` y `/redoc` automaticos con FastAPI. Confirmado en vivo: los dos responden 200.
