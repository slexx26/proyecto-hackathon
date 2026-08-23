# ADAPTA

**Fashion should adapt to you.**

Plataforma de descubrimiento y adaptación de moda accesible impulsada por IA.
Contás cómo te vestís, un motor determinista cruza tu perfil con las
características reales de cada prenda, y la IA te explica por qué encaja o qué
habría que modificarle.

Proyecto de hackathon · 22–23 de agosto de 2026 · Slater, José e Isaac.

## Estado

| Área | Estado |
|------|--------|
| Frontend | Funcional contra datos simulados. 6 rutas, sistema de diseño, accesibilidad. |
| Backend | **Pendiente.** `backend/` vacía. |
| Base de datos | **Pendiente.** |
| Motor de compatibilidad | **Pendiente.** Hay un suplente en `frontend/src/services/mocks/`. |
| IA / OpenAI | **Pendiente.** |

## Arranque rápido

Requisitos: Node 20+ y npm. Para el backend, Python 3.11+.

```bash
git clone https://github.com/slexx26/proyecto-hackathon.git
cd proyecto-hackathon/frontend
npm install
cp .env.example .env
npm run dev
```

Abrí <http://localhost:5173>. Con `VITE_USE_MOCK_API=true` (el valor por
defecto) el recorrido completo funciona **sin backend**.

### Verificación

```bash
cd frontend
npm run lint        # oxlint
npm run typecheck   # tsc -b --force
npm run build
```

## Rutas

| Ruta | Qué hace |
|------|----------|
| `/` | Landing: problema, propuesta y llamado a la acción |
| `/find-my-fit` | Formulario de perfil funcional |
| `/recommendations` | Resultados ordenados por compatibilidad, con evidencia |
| `/marketplace` | Catálogo con búsqueda y filtros |
| `/products/:productId` | Detalle, compatibilidad y adaptaciones posibles |
| `*` | 404 |

## Variables de entorno

**Frontend** (`frontend/.env`) — recordá que todo lo que empieza por `VITE_`
acaba en el bundle público. Aquí **no va ninguna clave**.

| Variable | Por defecto |
|----------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8000/api/v1` |
| `VITE_USE_MOCK_API` | `true` |

**Backend** (`backend/.env`, nunca versionado): `OPENAI_API_KEY`,
`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DATABASE_URL`, `FRONTEND_ORIGIN`.

## Documentación

| Archivo | Contenido |
|---------|-----------|
| [PROJECT_SPEC.md](PROJECT_SPEC.md) | Producto, arquitectura, alcance y criterios de éxito |
| [docs/api-contract.md](docs/api-contract.md) | Contrato REST y vocabularios cerrados |
| [docs/specs/](docs/specs/) | Las 41 secciones con responsables |
| [CLAUDE.md](CLAUDE.md) | Contexto e invariantes para Claude Code |

## Ramas

`feature/frontend` (Slater) · `feature/backend` (José) · `feature/ai` (Isaac)
→ se reúnen en `feature/integration` → un único PR a `main`.

## Avisos

El catálogo, las marcas y los precios son **ficticios** y existen solo para la
demostración. ADAPTA no da consejo médico ni sustituye la valoración de un
profesional de la salud, y no analiza el cuerpo de ninguna persona.
