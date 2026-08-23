# 25. Security — Seguridad

**Responsable:** José  
**Apoya: Todo el equipo**  
**Prioridad: P0**

## Qué hace

Protege secretos, valida entradas, limita CORS y evita subir credenciales, archivos peligrosos o datos innecesarios.

## Entregable

.env.example sin valores reales, .gitignore correcto, configuración CORS, validación Pydantic y revisión del historial Git.

## Integración

OpenAI y Supabase se configuran en backend/despliegue; nunca se pegan claves en React, prompts, commits o capturas.

## Estado

**En revisión.**

CORS restringido a `FRONTEND_ORIGIN`. `.env` fuera del repositorio. Row Level Security activo en Supabase: verificado que la clave anon puede leer pero no puede insertar (`42501 row-level security policy`). **Falta** revisar las políticas de RLS para cada tabla una por una, y confirmar qué puede escribir el backend con qué clave.
