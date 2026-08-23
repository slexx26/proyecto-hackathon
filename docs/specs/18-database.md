# 18. Database — Base de datos

**Responsable:** José  
**Apoya: Isaac define campos de compatibilidad; Slater valida consumo**  
**Prioridad: P0**

## Qué hace

Modela usuarios/perfiles, productos, características accesibles, recomendaciones y solicitudes de adaptación en Supabase PostgreSQL.

## Entregable

schema.sql, seed.sql, relaciones, restricciones, índices esenciales y variables de entorno documentadas.

## Integración

La API es la única capa que traduce entre la base de datos y el frontend.

## Estado

**En revisión.**

`supabase/schema.sql` aplicado en el proyecto real (confirmado leyendo la base con el cliente Python). **Falta `seed.sql`**: verificado con `count exacto` que `providers` y `products` siguen en 0 filas. La clave anon puede leer pero no escribir (RLS activo, como corresponde); sembrar los datos requiere correrlo en el SQL Editor o con `DATABASE_URL`/`service_role`.
