# Encargo para José — Backend y base de datos

> Pegale este archivo entero a tu Claude Code, o abrí el repo y decile
> "seguí `docs/encargo-jose.md`". El `CLAUDE.md` de la raíz se carga solo.

## Antes de empezar

```bash
git clone https://github.com/slexx26/proyecto-hackathon.git
cd proyecto-hackathon
git checkout feature/frontend      # acá está el contexto y el frontend
git checkout -b feature/backend    # tu rama, salí de acá
git rev-parse --abbrev-ref HEAD    # confirmá que decís feature/backend
```

Leé en este orden: `CLAUDE.md` → `PROJECT_SPEC.md` → `docs/api-contract.md`.
Ese contrato ya lo consume el frontend. **No lo cambies en silencio**: si algo
no te cuadra, avisá y lo cambiamos en los dos lados a la vez.

## Qué es ADAPTA, en dos líneas

Directorio de dos lados. La **persona** con discapacidad busca gratis y recibe
recomendaciones explicadas. El **negocio** (taller, ortopedia, emprendimiento,
proveedor de ayudas técnicas) paga por inscribirse, porque le lleva clientes.
El catálogo no es solo ropa: hay prótesis, órtesis, movilidad y apoyo diario.

## Tu entrega, en orden

### 1. Esqueleto FastAPI que arranque

```
backend/
├── main.py              app con prefijo /api/v1 y CORS
├── config.py            Settings con Pydantic, lee del entorno
├── database.py          cliente de Supabase
├── schemas/             Pydantic: product, provider, fit_profile, recommendation, chat
├── routers/             health, products, providers, recommendations, chat
├── tests/               pytest
├── requirements.txt
└── .env.example         claves VACÍAS
```

`GET /api/v1/health` devolviendo `{"status": "ok", "version": "0.1.0"}` es lo
primero. Cuando eso responda, avisá: yo apago los mocks y verifico contra vos.

CORS: solo el origen de `FRONTEND_ORIGIN`. Nunca `*`.

`backend/.env.example` con estas claves y **sin valores**:

```
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
DATABASE_URL=
FRONTEND_ORIGIN=http://localhost:5173
```

### 2. Base de datos en Supabase

`supabase/schema.sql` con al menos estas tablas:

| Tabla | Para qué |
|-------|----------|
| `providers` | los negocios inscritos: kind, plan, verified, location, contacto |
| `products` | el catálogo, con `provider_id` referenciando a `providers` |
| `product_adaptation_needs` | relación N:N entre producto y necesidades |
| `provider_applications` | solicitudes de inscripción que llegan del formulario |
| `adaptation_requests` | cuando alguien marca "me interesa esta adaptación" |

Restricciones que importan:

- `products.provider_id` con clave foránea y `ON DELETE RESTRICT`. Un producto
  huérfano rompe el bloque "dónde conseguirlo" del frontend.
- Los vocabularios cerrados (`adaptation_need`, `closure_type`, `category`,
  `provider_kind`, `provider_plan`) están al final de `docs/api-contract.md`.
  Usá **esos valores exactos**, en inglés y con guiones. La interfaz los
  traduce al español, vos no.
- Índices en `products.provider_id`, `products.category` y
  `providers.plan`.

### 3. Datos de demo

`supabase/seed.sql`, reproducible. Punto de partida ya hecho:

- `frontend/src/services/mocks/providers.mock.ts` — 8 negocios, los cinco
  tipos, los tres planes
- `frontend/src/services/mocks/products.mock.ts` — 14 productos, incluidos
  prótesis, órtesis, silla de ruedas y utensilios

Copiá esos datos tal cual. Están diseñados para que el motor de Isaac produzca
diferencias visibles: hay productos muy adaptados, uno convencional que solo
sirve tras adaptación, y varios intermedios. Si cambiás los datos, la demo
deja de ser predecible.

**Los negocios son ficticios y tienen que quedar etiquetados como tales.** No
los sustituyas por empresas reales: estaríamos afirmando que pagaron una
inscripción que nunca pagaron.

### 4. Endpoints

Formas exactas en `docs/api-contract.md`. Resumen:

```
GET  /api/v1/health
GET  /api/v1/products              query: search, category, adaptation_need, provider_id
GET  /api/v1/products/{id}         404 si no existe
GET  /api/v1/providers             query: search, kind, verified_only
GET  /api/v1/providers/{id}        404 si no existe
POST /api/v1/providers/applications
POST /api/v1/recommendations       llama al motor de Isaac
POST /api/v1/chat
```

Dos reglas de orden que **se deciden en el servidor**, no en el navegador:

1. `/recommendations` devuelve la lista ya ordenada por `score` descendente.
2. `/providers` devuelve `featured` → `verified` → `free`, y alfabético dentro
   de cada grupo. Ese orden es literalmente lo que el negocio compra al pagar:
   si lo pone el frontend, cualquiera lo ve y lo cambia desde el navegador.

### 5. Manejo de errores

- Formato de FastAPI. El frontend lee el campo `detail`.
- **Si OpenAI falla, no devuelvas 500.** Devolvé la recomendación sin el campo
  `explanation`. El frontend ya degrada solo y muestra la evidencia
  determinista. Un 500 ahí nos rompe la demo entera.
- Nunca devuelvas trazas ni nombres de tabla en el error.

### 6. Decisión que tenés que tomar vos

El cliente HTTP del frontend acepta hoy las dos formas: `{"data": {...}}` y el
objeto plano. **Elegí una y decímelo.** Yo toco un solo punto:
`unwrap()` en `frontend/src/services/api/client.ts`.

## Lo que NO tenés que construir

Cobro real de la inscripción · pasarela de pago · autenticación de usuarios ·
carrito · envíos · panel de administración del negocio · microservicios.

`POST /providers/applications` solo **recibe** la solicitud. El cobro se
coordina por fuera.

## Antes de pasármelo

```bash
cd backend
pytest
uvicorn main:app --reload     # confirmá que /docs y /redoc abren de verdad
curl http://localhost:8000/api/v1/health
```

Ojo: si tenés Python 3.14, alguna rueda puede no tener binario y fallar al
compilar. Si pasa, decilo, no lo escondas.

Revisá que no se te cuele nada: `git diff` antes de commitear, y que
`node_modules`, `.venv`, `dist` y `.env` **no** estén en el índice.

## Cómo me lo pasás

```bash
git add .
git commit -m "feat(backend): describir el cambio"
git push -u origin feature/backend
```

Y me avisás. Yo hago el merge en `feature/integration` y verifico el flujo
completo con `VITE_USE_MOCK_API=false`.

**No mergees a `main`. No mergees a `feature/frontend`.**

## Lo que espero de vuelta

1. La URL del backend corriendo, o cómo levantarlo.
2. Tu decisión sobre `{"data": ...}` vs objeto plano.
3. Si cambiaste algún nombre de campo del contrato, cuál y por qué.
4. Las credenciales de Supabase **por fuera del repo**, nunca en un commit.
