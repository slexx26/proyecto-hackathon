# backend — ADAPTA

**Responsable: José.** Todavía sin implementar.

Lee `../CLAUDE.md`, `../PROJECT_SPEC.md` y `../docs/api-contract.md` antes de
empezar: el contrato que el frontend ya consume está escrito ahí.

## Qué hace falta, en orden

1. `main.py` con FastAPI, prefijo `/api/v1` y `GET /api/v1/health`.
2. Settings con Pydantic leyendo del entorno; CORS restringido a
   `FRONTEND_ORIGIN` (nunca `*`).
3. `requirements.txt` y `.env.example` con las claves **vacías**.
4. Schemas Pydantic espejo de `frontend/src/types/`.
5. `GET /products` y `GET /products/{id}` contra Supabase.
6. `POST /recommendations`, que llama al motor determinista de Isaac.
7. Pruebas con pytest. Verificar que `/docs` y `/redoc` responden.

## Invariantes

- El compatibility score se calcula **aquí**, con lógica determinista. Mismo
  perfil + mismo catálogo ⇒ mismo score, siempre.
- OpenAI explica y sugiere; **nunca puntúa**.
- Si OpenAI falla, devolver la recomendación **sin** el campo `explanation`,
  no un 500. El frontend ya degrada con la evidencia determinista.
- Los errores no exponen trazas ni nombres de tabla.

## Variables de entorno

```
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
DATABASE_URL=
FRONTEND_ORIGIN=http://localhost:5173
```
