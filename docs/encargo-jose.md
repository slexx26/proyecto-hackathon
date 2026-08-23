# Encargo para José — Backend y base de datos

Ya te dejé montado el esqueleto y la base de datos. **Arranca y las pruebas
pasan**, verificado en Python 3.14. Lo que falta son los endpoints con datos
reales.

Este código es tuyo: cambialo si no te gusta. Lo único que no se cambia en
silencio son las formas del contrato (`docs/api-contract.md`), porque el
frontend ya las consume.

## 1. Levantalo (5 minutos)

```powershell
git clone https://github.com/slexx26/proyecto-hackathon.git
cd proyecto-hackathon
git checkout feature/frontend
git checkout -b feature/backend

cd backend
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m pytest
```

### Ojo con PowerShell (terminal de VS Code)

**No uses `.venv\Scripts\activate`.** En Windows suele fallar con
*"running scripts is disabled on this system"*, porque la política de
ejecución bloquea el script. Por eso arriba se llama directo a
`.venv\Scripts\python.exe`: hace exactamente lo mismo y no depende de la
política. Es como lo probé yo.

Si preferís activarlo igual, primero:

```powershell
Set-ExecutionPolicy -Scope Process -Bypass
.venv\Scripts\Activate.ps1
```

Eso vale solo para esa ventana, no cambia nada del sistema.

**Y no encadenes con `&&`.** PowerShell 5.1 (el que trae Windows por defecto)
no lo soporta y te da error de sintaxis. Poné un comando por línea, o usá `;`.

Para copiar el archivo de entorno, en PowerShell:

```powershell
Copy-Item .env.example .env
```

Después levantá el servidor:

```powershell
.venv\Scripts\python.exe -m uvicorn main:app --reload
```

Comprobá que responden:

- <http://localhost:8000/api/v1/health> → `{"status":"ok","version":"0.1.0"}`
- <http://localhost:8000/docs> → la documentación interactiva

## 2. Qué hay ya escrito

```
backend/
├── main.py                    app + CORS restringido + prefijo /api/v1
├── config.py                  Settings con Pydantic, único lector del entorno
├── requirements.txt           versiones reales, ya probadas en Python 3.14
├── .env.example               claves vacías
├── schemas/
│   ├── common.py              los vocabularios cerrados como Literal
│   ├── provider.py            Provider, ProviderApplication + base camelCase
│   ├── product.py             Product
│   ├── recommendation.py      FitProfile, MatchReason, Recommendation
│   └── health.py
├── routers/
│   └── health.py              hecho
└── tests/
    └── test_health.py         2 pruebas

supabase/
├── schema.sql                 5 tablas, 5 tipos enum, índices y restricciones
└── seed.sql                   8 negocios, 14 productos, 44 relaciones
```

Un detalle de los schemas: heredan de `CamelModel`, que traduce
`ships_nationwide` ↔ `shipsNationwide` automáticamente. El JSON sale en
camelCase (lo que espera el frontend) y el Python queda en snake_case. No
tenés que hacer nada, solo heredar de ahí.

## 3. Base de datos

En Supabase: **SQL Editor → pegar `supabase/schema.sql` → Run**. Después lo
mismo con `supabase/seed.sql`. Los dos se pueden volver a ejecutar sin
romperse.

Después copiá `SUPABASE_URL` y `SUPABASE_ANON_KEY` a tu `.env`.
**Mandámelas por fuera del repo, nunca en un commit.**

Dos decisiones que ya están tomadas en el esquema y conviene que entiendas:

- `products.provider_id` tiene `ON DELETE RESTRICT`. Un producto sin
  proveedor rompe el bloque "dónde conseguirlo", que es el final del
  recorrido del usuario.
- Las necesidades de cada producto están en tabla aparte
  (`product_adaptation_needs`) y no en un array, porque el motor de Isaac
  filtra y cuenta por necesidad; con índice sale mucho más barato.

## 4. Lo que te toca escribir

### `routers/products.py`

```
GET /api/v1/products         query: search, category, adaptation_need, provider_id
GET /api/v1/products/{id}    404 si no existe
```

Acordate de armar `adaptationNeeds` haciendo join con
`product_adaptation_needs`. El frontend espera esa lista dentro del producto.

### `routers/providers.py`

```
GET  /api/v1/providers                  query: search, kind, verified_only
GET  /api/v1/providers/{id}             404 si no existe
POST /api/v1/providers/applications     guarda en provider_applications
```

**El orden lo devolvés vos, ya ordenado:** `featured` → `verified` → `free`,
y alfabético dentro de cada grupo. Ese orden es literalmente lo que el negocio
compra al pagar la inscripción. Si lo pone el frontend, cualquiera lo ve en el
bundle público y lo cambia desde la consola del navegador.

El índice `providers_plan_idx` ya está creado para servir esa consulta.

### `routers/recommendations.py`

```
POST /api/v1/recommendations    body: { profile: FitProfile }
```

Llama al motor de Isaac (`backend/recommendations/`, él lo escribe) y devuelve
la lista **ya ordenada por score descendente**. Mismo razonamiento: el score
se calcula acá, el frontend solo lo pinta.

Cada recomendación lleva el `provider` incrustado. No hagas que el frontend
tenga que pedirlo aparte.

### `routers/chat.py` (P1)

```
POST /api/v1/chat    body: { message, history, productId? }
```

Se apoya en el servicio de IA de Isaac.

## 5. Errores

- Formato de FastAPI. El frontend lee el campo `detail`.
- **Si OpenAI falla, no devuelvas 500.** Devolvé la recomendación sin el campo
  `explanation`. El frontend ya degrada solo y muestra la evidencia
  determinista. Un 500 ahí nos rompe la demo entera delante del jurado, y
  OpenAI se cae más de lo que uno quisiera.
- Nunca devuelvas trazas ni nombres de tabla en un error.

## 6. La decisión que te toca a vos

El cliente HTTP del frontend acepta hoy las dos formas:

```json
{ "data": { ... } }
```
```json
{ ... }
```

**Elegí una y decímelo.** Yo cambio un solo punto: la función `unwrap()` en
`frontend/src/services/api/client.ts`. Mientras no decidas, las dos funcionan.

## 7. Lo que NO tenés que construir

Cobro real de la inscripción · pasarela de pago · autenticación de usuarios ·
carrito · envíos · panel de administración del negocio · microservicios.

`POST /providers/applications` solo **recibe** la solicitud. El cobro se
coordina por fuera de la plataforma.

## 8. Antes de pasármelo

```powershell
.venv\Scripts\python.exe -m pytest
.venv\Scripts\python.exe -m uvicorn main:app --reload
```

Revisá el diff antes de commitear. Que **no** entren al índice: `.venv`,
`__pycache__`, `.env`. El `.gitignore` de la raíz ya los cubre, pero mirá.

Buscá que no se te haya colado ninguna clave:

```powershell
git diff --cached | Select-String "sk-|eyJ"
```

## 9. Cómo me lo pasás

```powershell
git add .
git commit -m "feat(backend): describir el cambio"
git push -u origin feature/backend
```

Y me avisás. Yo hago el merge en `feature/integration` y verifico el flujo
completo con `VITE_USE_MOCK_API=false`.

**No mergees a `main`. No mergees a `feature/frontend`.**

## 10. Lo que espero de vuelta

1. Avisame apenas `/health` responda desde tu máquina: apago los mocks y
   pruebo contra vos.
2. Tu decisión sobre `{"data": ...}` vs objeto plano.
3. Si cambiaste algún nombre de campo del contrato, cuál y por qué.
4. Las credenciales de Supabase, por fuera del repo.

## Notas del entorno

Probé la instalación en **Python 3.14.0** y funcionó: `fastapi 0.141.1`,
`pydantic 2.13.4`, `uvicorn 0.52.4`, `pytest 9.1.1`. Las versiones de
`requirements.txt` son las que instalaron de verdad, no inventadas.

`starlette` pide `httpx2` en lugar de `httpx` para el cliente de pruebas; ya
está puesto así en `requirements.txt`. Si ves un aviso de deprecación con
`httpx` a secas, es por eso.
