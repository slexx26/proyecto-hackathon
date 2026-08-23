# Las 41 secciones de ADAPTA

Extraídas de `ADAPTA_Guia_Equipo_41_Secciones.docx`, la guía de trabajo del
equipo. Cada archivo conserva el texto original de la sección.

La fuente técnica del repositorio es [`PROJECT_SPEC.md`](../../PROJECT_SPEC.md);
esta carpeta sirve para asignar y controlar el avance.

| # | Sección | Responsable | Archivo |
|--:|---------|-------------|---------|
| 1 | Project — Producto | Equipo · coordinación: Slater | [01-project.md](01-project.md) |
| 2 | Hackathon Goals — Metas | Equipo | [02-hackathon-goals.md](02-hackathon-goals.md) |
| 3 | Architecture — Arquitectura | José | [03-architecture.md](03-architecture.md) |
| 4 | Architectural Principles — Principios | José | [04-architectural-principles.md](04-architectural-principles.md) |
| 5 | Project Structure — Estructura | Equipo · coordinación: Slater | [05-project-structure.md](05-project-structure.md) |
| 6 | Frontend Routes — Rutas | Slater | [06-frontend-routes.md](06-frontend-routes.md) |
| 7 | Landing Page — Inicio | Slater | [07-landing-page.md](07-landing-page.md) |
| 8 | Find My Fit Page — Perfil funcional | Slater | [08-find-my-fit-page.md](08-find-my-fit-page.md) |
| 9 | Recommendations Page — Resultados | Slater | [09-recommendations-page.md](09-recommendations-page.md) |
| 10 | Compatibility Engine — Motor | Isaac | [10-compatibility-engine.md](10-compatibility-engine.md) |
| 11 | AI Service — Servicio de IA | Isaac | [11-ai-service.md](11-ai-service.md) |
| 12 | AI Recommendation Explanation — Explicación | Isaac | [12-ai-recommendation-explanation.md](12-ai-recommendation-explanation.md) |
| 13 | Adaptation Experience — Adaptaciones | Isaac + Slater | [13-adaptation-experience.md](13-adaptation-experience.md) |
| 14 | Marketplace Page — Catálogo | Slater | [14-marketplace-page.md](14-marketplace-page.md) |
| 15 | Product Detail Page — Detalle | Slater | [15-product-detail-page.md](15-product-detail-page.md) |
| 16 | Optional Image Analysis — Imagen opcional | Isaac | [16-optional-image-analysis.md](16-optional-image-analysis.md) |
| 17 | Chatbot — Asistente | Isaac + Slater | [17-chatbot.md](17-chatbot.md) |
| 18 | Database — Base de datos | José | [18-database.md](18-database.md) |
| 19 | API Endpoints — Contrato REST | José | [19-api-endpoints.md](19-api-endpoints.md) |
| 20 | Frontend Components — Componentes | Slater | [20-frontend-components.md](20-frontend-components.md) |
| 21 | UI Design System — Sistema visual | Slater | [21-ui-design-system.md](21-ui-design-system.md) |
| 22 | Responsive Design — Adaptabilidad | Slater | [22-responsive-design.md](22-responsive-design.md) |
| 23 | Accessibility — Accesibilidad | Slater | [23-accessibility.md](23-accessibility.md) |
| 24 | Error Handling — Manejo de errores | José | [24-error-handling.md](24-error-handling.md) |
| 25 | Security — Seguridad | José | [25-security.md](25-security.md) |
| 26 | Seed Data — Datos de demo | José | [26-seed-data.md](26-seed-data.md) |
| 27 | Demo Flow — Flujo de demostración | Equipo · coordinación: Slater | [27-demo-flow.md](27-demo-flow.md) |
| 28 | Demo Priority — Prioridad | Equipo | [28-demo-priority.md](28-demo-priority.md) |
| 29 | README — Inicio rápido | Equipo · coordinación: Slater | [29-readme.md](29-readme.md) |
| 30 | Architecture Documentation — Documento técnico | José | [30-architecture-documentation.md](30-architecture-documentation.md) |
| 31 | API Documentation — Documentación API | José | [31-api-documentation.md](31-api-documentation.md) |
| 32 | Testing — Pruebas | Equipo | [32-testing.md](32-testing.md) |
| 33 | Deployment — Despliegue | Equipo | [33-deployment.md](33-deployment.md) |
| 34 | Git Workflow — Flujo Git | Equipo | [34-git-workflow.md](34-git-workflow.md) |
| 35 | Important Engineering Rule — Regla central | Equipo | [35-important-engineering-rule.md](35-important-engineering-rule.md) |
| 36 | What Not to Build — Fuera de alcance | Equipo | [36-what-not-to-build.md](36-what-not-to-build.md) |
| 37 | Success Criteria — Criterios de éxito | Equipo | [37-success-criteria.md](37-success-criteria.md) |
| 38 | Development Order — Orden de desarrollo | Equipo · coordinación de integración | [38-development-order.md](38-development-order.md) |
| 39 | Code Generation Rule — Regla para Claude Code | Equipo | [39-code-generation-rule.md](39-code-generation-rule.md) |
| 40 | Final Product Positioning — Presentación | Slater | [40-final-product-positioning.md](40-final-product-positioning.md) |
| 41 | First Task — Primera tarea | Equipo · coordinación: Slater | [41-first-task.md](41-first-task.md) |

## Cómo se reúne el trabajo

1. Cada responsable trabaja en su rama y hace commits pequeños.
2. Corre sus verificaciones locales y hace push.
3. Abre PR de su rama hacia `feature/integration`.
4. El equipo revisa los archivos compartidos y resuelve conflictos a conciencia.
5. Se prueba frontend + backend + base de datos + IA de extremo a extremo.
6. Un único PR de `feature/integration` hacia `main`.

## Antes de cada PR

- [ ] No hay claves ni `.env` reales
- [ ] Build, lint y tests pasan
- [ ] El contrato de API no cambió sin aviso
- [ ] Hay estados de carga y de error
- [ ] Se probó la navegación por teclado
- [ ] El PR explica qué cambió y cómo probarlo

## Definición de terminado

El recorrido Landing → Find My Fit → Recommendations → Product Detail →
Adaptation funciona; el score es determinista; la explicación de IA es
coherente; no se exponen claves; hay datos de demo; el sistema está
desplegado; y el equipo puede repetir la presentación sin editar código.
