# PROJECT_SPEC — ADAPTA

> Fuente técnica del repositorio. Se deriva de la guía de 41 secciones del
> equipo (`docs/specs/`). Si algo contradice a este archivo, gana este archivo.

## 1. Producto

**ADAPTA · Fashion should adapt to you.**

Plataforma de descubrimiento y adaptación de moda accesible impulsada por IA.
No es una tienda genérica con filtro de accesibilidad: el centro del producto
es decidir si una prenda le sirve a una persona concreta, y explicar por qué.

**Problema.** Las tiendas describen talla, color y material. Ninguna dice si la
prenda se puede poner con una mano, si se abrocha estando sentada, o si la
costura interna va a molestar. Esa información existe en la prenda, pero nadie
la estructura. Sin ella, la persona compra, prueba y devuelve.

**Usuario objetivo.** Personas con movilidad reducida, destreza manual
limitada, sensibilidad sensorial o dispositivos médicos, y quienes las cuidan.

**Recorrido principal.**

```
necesidades → perfil accesible → compatibilidad → recomendación → explicación → adaptación
```

**Regla de posicionamiento (sección 40):** la landing, la demo y la
presentación cuentan la misma historia. El diferenciador no es el catálogo, es
el motor de compatibilidad explicado.

## 2. Metas del hackathon

Prioridad, en este orden:

1. **Un flujo completo** por encima de muchas funciones incompletas.
2. **Calidad técnica**: contratos claros, tipado estricto, sin secretos.
3. **UI/UX y accesibilidad**: un producto sobre accesibilidad tiene que ser accesible.
4. **Originalidad**: el motor determinista explicado por IA.
5. **Demo estable**: repetible sin editar código.

## 3. Arquitectura

```
   Navegador (React 19 + Vite + TS)
            │  solo HTTPS a FastAPI
            ▼
   FastAPI  /api/v1
     ├── products        ──▶ Supabase PostgreSQL
     ├── recommendations ──▶ Compatibility Engine (Python, determinista)
     │                        └──▶ AI Service ──▶ OpenAI (explica, no puntúa)
     ├── chat            ──▶ AI Service
     └── health
```

**Límites que no se cruzan:**

1. El compatibility score lo calcula el **backend** con lógica determinista.
   El frontend solo lo muestra. Nunca lo recalcula.
2. OpenAI interpreta, estructura, explica y sugiere. **Nunca puntúa.**
3. El navegador habla **solo** con FastAPI. Nunca con Supabase, OpenAI ni
   PostgreSQL directamente.
4. `OPENAI_API_KEY` y las claves de servicio de Supabase **jamás** en el
   frontend. Todo lo que empieza por `VITE_` acaba en el bundle público.
5. Sin afirmaciones médicas. Sin analizar el cuerpo de la persona.
6. Los datos ficticios se etiquetan como tales, nunca como empresas reales.

## 4. Estructura del monorepo

```
proyecto-hackathon/
├── frontend/          React 19 · Vite 8 · TypeScript 6 · Tailwind 4   [Slater]
├── backend/           FastAPI · Pydantic · Supabase · OpenAI          [José]
├── supabase/          schema.sql · seed.sql                           [José]
├── docs/              specs/ · api.md · architecture.md
├── PROJECT_SPEC.md    este archivo
├── CLAUDE.md          instrucciones para Claude Code
└── README.md          arranque rápido
```

## 5. Contrato de API

`docs/api-contract.md` tiene los payloads completos. Resumen:

| Método | Ruta | Cuerpo | Respuesta |
|--------|------|--------|-----------|
| GET | `/api/v1/health` | — | `{ status, version? }` |
| GET | `/api/v1/products` | query: `search`, `category`, `adaptation_need` | `Product[]` |
| GET | `/api/v1/products/{id}` | — | `Product` · 404 si no existe |
| POST | `/api/v1/recommendations` | `{ profile: FitProfile }` | `{ recommendations, generatedAt }` |
| POST | `/api/v1/chat` | `{ message, history, productId? }` | `{ reply }` |
| POST | `/api/v1/image-analysis` | multipart `file` | `ImageAnalysisResult` (P2) |

Los tipos de `frontend/src/types/` son el espejo de los schemas Pydantic.
**Si cambia uno, cambia el otro en el mismo PR.**

**Sin cerrar:** el cliente acepta tanto `{ data: T }` como `T` plano. Cuando el
backend fije el formato, el único punto a tocar es `unwrap()` en
`frontend/src/services/api/client.ts`.

## 6. Prioridades

| Nivel | Alcance |
|-------|---------|
| **P0** | Landing · Find My Fit · Recommendations · Product Detail · Adaptations · motor determinista · products/recommendations API · seed · accesibilidad · despliegue |
| **P1** | Marketplace con filtros · Chatbot |
| **P2** | Análisis de imagen |

Regla: no se abre nada de P1 mientras haya P0 sin integrar.

## 7. Fuera de alcance (sección 36)

Microservicios · Kubernetes · pagos · logística de envíos · autenticación
compleja · red social · modelos propios entrenados · carrito de compras ·
panel de administración · internacionalización.

## 8. Criterios de éxito (sección 37)

- [ ] El recorrido Landing → Find My Fit → Recommendations → Product Detail → Adaptation funciona de punta a punta.
- [ ] El mismo perfil produce siempre el mismo score.
- [ ] La explicación de IA es coherente con la evidencia y no la contradice.
- [ ] Hay al menos una adaptación visible y solicitable.
- [ ] Navegación completa por teclado, con foco visible.
- [ ] Ningún secreto en el repositorio ni en el bundle.
- [ ] Desplegado y probado desde un dispositivo externo.
- [ ] El equipo repite la demo sin editar código.

## 9. Orden de desarrollo (sección 38)

1. **Base y contratos** — este archivo, `docs/api-contract.md`, estructura. ✅
2. **Datos y API** — `schema.sql`, `seed.sql`, endpoints de products.
3. **Motor** — compatibility engine con pruebas unitarias.
4. **Experiencia** — frontend contra la API real (`VITE_USE_MOCK_API=false`). ✅ (contra mocks)
5. **IA** — explicaciones y chatbot.
6. **Extras** — marketplace avanzado, análisis de imagen.
7. **Pruebas, despliegue y ensayo de demo.**

## 10. Flujo Git (sección 34)

| Rama | Dueño |
|------|-------|
| `feature/frontend` | Slater |
| `feature/backend` | José |
| `feature/ai` | Isaac |
| `feature/integration` | punto de reunión del equipo |
| `main` | solo desde `feature/integration`, con PR y revisión |

Nadie hace push directo a `main`. Nadie mergea automáticamente.

## 11. Equipo

| Persona | Área |
|---------|------|
| Slater | Frontend y UX/UI |
| José | Backend y base de datos |
| Isaac | IA y motor de recomendaciones |
| Todos | Integración, pruebas, documentación, despliegue y demo |
