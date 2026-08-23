# 24. Error Handling — Manejo de errores

**Responsable:** José  
**Apoya: Slater e Isaac**  
**Prioridad: P0**

## Qué hace

Define respuestas y estados cuando fallan validación, red, base de datos, OpenAI o datos vacíos.

## Entregable

Formato común de error, logs útiles, mensajes amigables, reintentos limitados y fallbacks de demo.

## Integración

Cada capa transforma errores técnicos sin ocultarlos ni mostrar información sensible.

## Estado

**En revisión.**

Formato de error fijado en `docs/api-contract.md`; el frontend cubre los cuatro estados en toda pantalla con datos y degrada sin `explanation`. **Falta** el lado del backend.
