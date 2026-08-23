# Cómo consumir la API — ADAPTA

Esta página explica **cómo usar** la API. La fuente exacta de cada
payload, campo por campo, es [`docs/api-contract.md`](api-contract.md);
acá no se repite todo, solo se explica el uso práctico.

Base: `/api/v1`. Todo JSON en UTF-8. Los campos del cuerpo van en
camelCase; los parámetros de query van en snake_case. No hay
autenticación: ningún endpoint requiere token ni cookie de sesión.

## Documentación interactiva

FastAPI genera Swagger en `/docs` y ReDoc en `/redoc` a partir de los
`response_model` de cada router. Con el servidor levantado:

```powershell
cd backend
.venv\Scripts\python.exe -m uvicorn main:app --reload
```

`http://localhost:8000/docs` deja probar cada endpoint a mano, con
ejemplos generados automáticamente desde los schemas de Pydantic.

## Endpoints

| Método | Ruta | Para qué |
|---|---|---|
| GET | `/health` | Confirmar que el servidor responde |
| GET | `/products` | Catálogo, con filtros `search`, `category`, `adaptation_need`, `provider_id` |
| GET | `/products/{id}` | Un producto puntual |
| GET | `/providers` | Directorio de negocios, ya ordenado por plan |
| GET | `/providers/{id}` | Un negocio puntual |
| POST | `/providers/applications` | Solicitud de inscripción de un negocio (público, limitado a 5/min por IP) |
| POST | `/recommendations` | El corazón del producto: perfil → score determinista + explicación + adaptaciones |
| POST | `/chat` | Asistente de apoyo, con contexto del catálogo real |

## Errores

Formato de FastAPI por defecto: `{"detail": "mensaje"}`.

| Código | Cuándo |
|---|---|
| 400 | Payload inválido |
| 404 | Recurso que no existe |
| 422 | Falla la validación de Pydantic (ej. un correo con formato inválido) |
| 429 | Se superó el límite de peticiones en `POST /providers/applications` |
| 500 | Error interno no previsto. Nunca lleva traza ni nombre de tabla |
| 502 | Supabase respondió con un error al leer o escribir |
| 503 | Supabase u OpenAI no están configurados |

## Ejemplo rápido: pedir una recomendación

```powershell
curl -X POST http://localhost:8000/api/v1/recommendations `
  -H "Content-Type: application/json" `
  -d '{\"profile\": {\"needs\": [\"one-handed-dressing\"], \"handDexterity\": \"one-hand\"}}'
```

Devuelve `{ "recommendations": [...], "generatedAt": "..." }`, ya ordenado
por `score` descendente, con el `provider` de cada producto incrustado. Si
la explicación de OpenAI falla o no hay clave configurada, el campo
`explanation` viene ausente: no es un error, el frontend ya sabe mostrar
solo la evidencia determinista (`reasons`).

## Ejemplo rápido: preguntarle al chat

```powershell
curl -X POST http://localhost:8000/api/v1/chat `
  -H "Content-Type: application/json" `
  -d '{\"message\": \"quiero unos tenis Paso sin cordones\", \"history\": []}'
```

Si el asistente identifica una prenda concreta del catálogo, la respuesta
trae `productId` y `productName`: eso es lo que el frontend usa para
mostrar el botón que lleva directo al detalle del producto.

## Variables de entorno del backend

`backend/.env.example`, todas vacías en el repositorio:

```
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
DATABASE_URL=
FRONTEND_ORIGIN=http://localhost:5173
```

Sin `SUPABASE_URL` y `SUPABASE_ANON_KEY`, cualquier endpoint que dependa
de la base de datos responde 503 en vez de 500: es una falla de
configuración esperada, no un bug. Sin `OPENAI_API_KEY`, `/recommendations`
y `/chat` siguen funcionando igual, solo sin el texto redactado por IA.
