# 11. AI Service — Servicio de IA

**Responsable:** Isaac  
**Apoya: José asegura integración y secretos**  
**Prioridad: P0**

## Qué hace

Centraliza llamadas a OpenAI para interpretar lenguaje natural, estructurar necesidades, explicar resultados y sugerir adaptaciones.

## Entregable

Servicio backend con salida estructurada, esquemas Pydantic, timeouts, manejo de fallos y fallback seguro.

## Integración

Usa OPENAI_API_KEY solo en backend y entrega datos validados a los demás módulos.

## Estado

**Completo.**

`backend/recommendations/explanation.py`. Con `OPENAI_API_KEY` intenta OpenAI y le pasa la evidencia ya calculada, sin poder tocar el score; sin clave, o si la llamada falla, cae a una plantilla determinista que nunca rompe. **Falta** probarlo con una clave real.
