# ADAPTA — instrucciones para Claude Code

Lee esto entero antes de tocar nada. Este archivo se carga solo en cada sesión.

## Qué es

**ADAPTA · Fashion should adapt to you.** Directorio centralizado, con IA, de
productos y negocios de moda y vida accesible. Proyecto de hackathon de 48
horas.

Mercado de dos lados: la **persona** con discapacidad busca gratis y recibe
recomendaciones explicadas; el **negocio** (taller, ortopedia, emprendimiento,
proveedor de ayudas técnicas) paga por inscribirse en el directorio, porque le
lleva clientes que hoy no lo encuentran.

El catálogo no es solo ropa: incluye calzado, prótesis, órtesis, movilidad y
productos de apoyo diario.

La definición completa está en `PROJECT_SPEC.md`. El contrato de la API, en
`docs/api-contract.md`. La división del trabajo en 41 secciones, en
`docs/specs/`. **No inventes requisitos: están escritos.**

## Reparto y ramas

| Persona | Área | Rama |
|---------|------|------|
| Slater | Frontend y UX/UI | `feature/frontend` |
| José | Backend y base de datos | `feature/backend` |
| Isaac | IA y motor de recomendaciones | `feature/ai` |
| Equipo | Integración | `feature/integration` |

**Antes de modificar nada:** `git rev-parse --abbrev-ref HEAD`. Si no estás en
la rama del área que te toca, detente y pregunta. No trabajes en `main`.

No toques archivos del área de otra persona sin decirlo explícitamente en el
resumen. Si un cambio tuyo obliga a cambiar un contrato compartido, dilo antes.

## Reglas de arquitectura que no se rompen

1. El compatibility score lo calcula el **backend** con lógica determinista.
   El frontend solo lo muestra. Nunca lo recalcula.
2. OpenAI interpreta, estructura, explica y sugiere. **Nunca puntúa.**
3. El navegador habla **solo** con FastAPI. Nunca con Supabase, OpenAI ni
   PostgreSQL.
4. `OPENAI_API_KEY` y las claves de servicio de Supabase **jamás** en el
   frontend: todo lo que empieza por `VITE_` acaba en el bundle público.
5. No crees archivos `.env` con secretos reales. Solo `.env.example` vacíos.
6. Sin afirmaciones médicas. Sin analizar el cuerpo de la persona.
7. Los datos ficticios se etiquetan como tales, nunca como empresas reales.
8. Toda recomendación termina diciendo **dónde conseguir el producto**. Una
   recomendación sin proveedor no sirve: deja a la persona igual que al empezar.
9. La insignia "verificado" significa que el negocio existe y ofrece lo que
   dice. **No** es una valoración de calidad y no debe redactarse como tal.
10. Fuera de alcance: microservicios, Kubernetes, **cobro real de la
    inscripción**, envíos, autenticación compleja, carrito, panel de
    administración. Los planes y precios se muestran; la pasarela de pago no
    se implementa.

## Frontend — invariantes

Stack: React 19.2 · react-router-dom 7.18 · Vite 8.2 · TypeScript 6 ·
Tailwind 4.3 (vía `@tailwindcss/vite`) · oxlint 1.75.

- Ningún componente llama a `fetch` → todo pasa por `src/services/api/`.
- Ningún componente lee `import.meta.env` → todo pasa por `src/config/env.ts`.
- Ningún componente importa un mock → solo la capa de servicios elige la fuente.
- Cero `any`.
- Toda pantalla con datos cubre los cuatro estados: loading / success / empty / error.
- Todo control de formulario tiene un `<label>` real. Los grupos son
  `<fieldset>` con `<legend>`. El color nunca es el único portador de
  significado.

### Trampas del entorno, ya pagadas

- `tsconfig.app.json` usa `erasableSyntaxOnly`: **prohibidos los `enum`**.
  Usá uniones de strings.
- `verbatimModuleSyntax`: los tipos se importan con `import type`.
- **No añadas `baseUrl`.** TypeScript 6 lo marca obsoleto y rompe la
  compilación. Los `paths` (`@/*`) ya se resuelven relativos al tsconfig.
- Tailwind v4 se configura **en CSS con `@theme`** (`src/styles/theme.css`).
  No hay `tailwind.config.js`. No mezcles instrucciones de v3.
- `useAsync` recibe una **clave de petición** (string), no un array de
  dependencias. Ej: `filtersKey`, `productId ?? 'sin-producto'`.
- Los archivos que exportan un componente no deben exportar además constantes
  o hooks: oxlint lo marca por Fast Refresh. Separalos.

### Verificación obligatoria antes de commitear

```bash
cd frontend
npm run lint        # oxlint, debe quedar en CERO avisos
npm run typecheck   # tsc -b --force
npm run build
```

No silencies avisos: arreglalos, o explicá por qué no se puede.

## Backend — punto de partida

`backend/` está vacía. Le toca a José. Lo que debe cumplir:

- FastAPI + Pydantic. Python 3.14 en la máquina de Slater; **es una versión muy
  reciente y alguna rueda puede no tener binario**. Si falla al compilar,
  reportalo, no lo silencies.
- Prefijo `/api/v1`. Empezá por `GET /api/v1/health`.
- CORS restringido a `FRONTEND_ORIGIN`, nunca `*`.
- Settings con Pydantic leyendo del entorno. `backend/.env.example` con las
  claves vacías.
- Los schemas Pydantic son el espejo de `frontend/src/types/`. Ver
  `docs/api-contract.md` para las formas exactas.
- Pruebas con pytest. Verificá que `/docs` y `/redoc` responden de verdad.

## Cómo ejecutar

```bash
# Frontend — funciona completo sin backend
cd frontend
npm install
cp .env.example .env
npm run dev            # http://localhost:5173
```

Con `VITE_USE_MOCK_API=true` (por defecto) el recorrido entero funciona con
datos simulados. Cuando el backend responda, poner `false` y verificar que la
interfaz **no necesita ningún cambio**. Si lo necesita, la abstracción estaba
mal hecha.

## Cómo trabajar

Por fases pequeñas. Inspeccioná los archivos existentes antes de escribir.
Conservá el trabajo que ya está. Al terminar: resumen de archivos tocados,
comandos de verificación con su resultado real, y un commit con mensaje
descriptivo en la rama que corresponda.

**No hagas push sin confirmarlo. No mergees hacia `main`.**

Antes de cada PR: sin claves ni `.env` reales · build, lint y tests pasan ·
el contrato de API no cambió sin aviso · hay estados de carga y error · se
probó la navegación por teclado.
