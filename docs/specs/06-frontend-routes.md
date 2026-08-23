# 6. Frontend Routes — Rutas

**Responsable:** Slater  
**Apoya: José define contratos; Isaac define datos de recomendación**  
**Prioridad: P0**

## Qué hace

Define las URLs y navegación entre landing, Find My Fit, recomendaciones, marketplace, producto, adaptación y página 404.

## Entregable

Router funcionando, navegación accesible, rutas con parámetros y NotFoundPage.

## Integración

Cada ruta debe consumir el contrato de API correspondiente sin incluir lógica de negocio pesada.

## Estado

**Completo** (Slater).

`frontend/src/app/router.tsx`. Seis rutas bajo `RootLayout`, con `products/:productId` y comodín 404.
