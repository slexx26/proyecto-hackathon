# 13. Adaptation Experience — Adaptaciones

**Responsable:** Isaac + Slater  
**Apoya: José guarda solicitudes**  
**Prioridad: P0**

## Qué hace

Propone modificaciones posibles para una prenda convencional y permite expresar interés o solicitar una adaptación.

## Entregable

Sugerencias estructuradas, interfaz con beneficios/limitaciones y CTA de solicitud; endpoint o persistencia mínima.

## Integración

Une la IA, el producto, el perfil del usuario y el módulo de solicitudes de adaptación.

## Estado

**Completo.**

`backend/recommendations/adaptations.py` genera las sugerencias por cada necesidad en `gap`, con `limitation` siempre presente. El frontend ya lo consume vía `AdaptationPanel.tsx`. **Falta** el guardado de solicitudes ("me interesa esta adaptación"), que hoy vive solo en memoria del navegador.
