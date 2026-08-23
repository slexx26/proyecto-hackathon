# supabase — ADAPTA

**Responsable: José.** Secciones 18 y 26.

Pendiente:

- `schema.sql` — perfiles, productos, características accesibles,
  recomendaciones y solicitudes de adaptación. Con restricciones e índices.
- `seed.sql` — catálogo pequeño pero diverso, con atributos suficientes para
  que el motor produzca **diferencias visibles** de compatibilidad.

Los vocabularios cerrados (`adaptation_need`, `closure_type`, `category`)
están en `../docs/api-contract.md`. Usá esos valores exactos.

Punto de partida para el seed: `../frontend/src/services/mocks/products.mock.ts`
tiene 8 prendas ficticias ya diseñadas para dar resultados contrastados,
incluida una prenda convencional que solo encaja tras una adaptación.

**Los datos son ficticios y deben quedar etiquetados como tales.**
