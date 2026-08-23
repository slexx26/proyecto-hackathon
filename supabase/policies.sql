
-- ADAPTA — políticas de acceso (RLS)
--
-- Sin esto, la clave `anon` no puede leer nada: Supabase activa Row Level
-- Security por defecto, y una tabla con RLS activo y CERO políticas le
-- niega el acceso a todo el mundo, incluida la lectura. Eso es lo que
-- estaba pasando: el seed cargó los datos bien, pero nadie sin política
-- podía verlos. No es un bug de la app, es RLS haciendo exactamente lo que
-- tiene que hacer sin que nadie le haya dicho todavía qué permitir.
--
-- Aplicar en el SQL Editor DESPUÉS de `schema.sql` y `seed.sql`. Se puede
-- volver a correr sin romperse. Ya se corrió una vez (confirmado: 8
-- providers, 14 products, 44 relaciones), correrlo de nuevo no hace daño.

alter table providers enable row level security;
alter table products enable row level security;
alter table product_adaptation_needs enable row level security;
alter table provider_applications enable row level security;
alter table adaptation_requests enable row level security;

-- ---------------------------------------------------------------------------
-- Lectura pública: el catálogo y el directorio son la razón de ser del
-- producto. Nadie necesita cuenta para buscar ropa adaptada.
-- ---------------------------------------------------------------------------

drop policy if exists "Lectura pública de negocios" on providers;
create policy "Lectura pública de negocios"
  on providers for select
  using (true);

drop policy if exists "Lectura pública de productos" on products;
create policy "Lectura pública de productos"
  on products for select
  using (true);

drop policy if exists "Lectura pública de necesidades cubiertas" on product_adaptation_needs;
create policy "Lectura pública de necesidades cubiertas"
  on product_adaptation_needs for select
  using (true);

-- ---------------------------------------------------------------------------
-- Escritura pública SOLO para crear, nunca para leer, editar o borrar.
--
-- El formulario de /for-business y el botón "me interesa esta adaptación"
-- son públicos, sin login. Cualquiera puede insertar una solicitud, pero
-- nadie puede leer las que ya existen ni tocar las de otra persona: eso
-- protege el correo y la descripción que alguien mandó.
-- ---------------------------------------------------------------------------

drop policy if exists "Cualquiera puede enviar una solicitud de negocio" on provider_applications;
create policy "Cualquiera puede enviar una solicitud de negocio"
  on provider_applications for insert
  with check (true);

drop policy if exists "Cualquiera puede pedir una adaptación" on adaptation_requests;
create policy "Cualquiera puede pedir una adaptación"
  on adaptation_requests for insert
  with check (true);

-- Verificación rápida, corre gratis: si algo sale en 0 después de correr
-- seed.sql, avisen antes de seguir.
select
  (select count(*) from providers) as providers,
  (select count(*) from products) as products,
  (select count(*) from product_adaptation_needs) as relaciones;
