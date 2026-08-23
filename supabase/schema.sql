
drop table if exists adaptation_requests cascade;
drop table if exists provider_applications cascade;
drop table if exists product_adaptation_needs cascade;
drop table if exists products cascade;
drop table if exists providers cascade;

drop type if exists provider_kind cascade;
drop type if exists provider_plan cascade;
drop type if exists product_category cascade;
drop type if exists closure_type cascade;
drop type if exists adaptation_need cascade;

-- ---------------------------------------------------------------------------
-- Vocabularios cerrados
--
-- Los valores van en inglés y con guiones, EXACTAMENTE como en
-- `docs/api-contract.md`. La interfaz los traduce al español en
-- `frontend/src/utils/labels.ts`; la base de datos no guarda español.
-- ---------------------------------------------------------------------------

create type provider_kind as enum (
  'adaptive-apparel',
  'adaptation-workshop',
  'prosthetics',
  'mobility-aids',
  'daily-living-aids'
);

create type provider_plan as enum ('free', 'verified', 'featured');

create type product_category as enum (
  'tops',
  'bottoms',
  'outerwear',
  'footwear',
  'underwear',
  'accessories',
  'prosthetics',
  'orthotics',
  'mobility',
  'daily-living'
);

create type closure_type as enum (
  'magnetic',
  'velcro',
  'zipper-loop',
  'zipper',
  'buttons',
  'elastic',
  'none'
);

create type adaptation_need as enum (
  'one-handed-dressing',
  'seated-wearing',
  'magnetic-closure',
  'no-fine-motor',
  'sensory-friendly',
  'easy-access-medical',
  'prosthesis-friendly',
  'adjustable-fit',
  'thermoregulation'
);

-- ---------------------------------------------------------------------------
-- providers — los negocios inscritos
--
-- Es la entidad central del modelo: el negocio paga por estar acá.
-- ---------------------------------------------------------------------------

create table providers (
  id                text primary key,
  name              text not null,
  kind              provider_kind not null,
  description       text not null,
  location          text not null,
  ships_nationwide  boolean not null default false,

  -- Contacto. Al menos uno de los tres debería existir, o la ficha no sirve
  -- para nada: la persona no tendría cómo llegar al negocio.
  contact_website   text,
  contact_phone     text,
  contact_email     text,

  plan              provider_plan not null default 'free',

  -- Verificado = el equipo comprobó que el negocio existe y ofrece lo que
  -- dice. NO es una valoración de calidad.
  verified          boolean not null default false,

  created_at        timestamptz not null default now(),

  constraint providers_contacto_minimo check (
    contact_website is not null
    or contact_phone is not null
    or contact_email is not null
  )
);

-- El orden del directorio se calcula en el servidor, y este índice lo sirve.
create index providers_plan_idx on providers (plan, name);
create index providers_kind_idx on providers (kind);

-- ---------------------------------------------------------------------------
-- products — el catálogo
-- ---------------------------------------------------------------------------

create table products (
  id            text primary key,

  -- RESTRICT a propósito: un producto sin proveedor rompe el bloque
  -- "dónde conseguirlo" del frontend, que es el final del recorrido.
  provider_id   text not null references providers (id) on delete restrict,

  name          text not null,
  brand         text not null,
  category      product_category not null,

  -- Entero en la unidad menor de la moneda. CRC no usa decimales.
  price         integer not null check (price >= 0),
  currency      text not null default 'CRC',

  description   text not null,
  closure_type  closure_type not null default 'none',

  -- Arrays simples: son listas cortas que siempre se leen enteras.
  materials     text[] not null default '{}',
  limitations   text[] not null default '{}',
  sizes         text[] not null default '{}',

  -- El frontend espera [{ url, alt }]. El `alt` es obligatorio por
  -- accesibilidad, así que viaja junto a la imagen, no aparte.
  images        jsonb not null default '[]'::jsonb,

  in_stock      boolean not null default true,
  created_at    timestamptz not null default now()
);

create index products_provider_idx on products (provider_id);
create index products_category_idx on products (category);

-- ---------------------------------------------------------------------------
-- product_adaptation_needs — qué necesidades cubre cada producto
--
-- Tabla aparte y no un array, porque el motor de compatibilidad filtra y
-- cuenta por necesidad: con un índice esto es mucho más barato.
-- ---------------------------------------------------------------------------

create table product_adaptation_needs (
  product_id  text not null references products (id) on delete cascade,
  need        adaptation_need not null,
  primary key (product_id, need)
);

create index product_needs_need_idx on product_adaptation_needs (need);

-- ---------------------------------------------------------------------------
-- provider_applications — solicitudes de inscripción
--
-- Las llena el formulario de /for-business. NO se procesa ningún pago acá
-- (sección 36): el cobro se coordina fuera de la plataforma.
-- ---------------------------------------------------------------------------

create table provider_applications (
  id             uuid primary key default gen_random_uuid(),
  business_name  text not null,
  kind           provider_kind not null,
  location       text not null,
  email          text not null,
  description    text not null,
  status         text not null default 'pending'
                 check (status in ('pending', 'contacted', 'approved', 'rejected')),
  created_at     timestamptz not null default now()
);

create index provider_applications_status_idx on provider_applications (status, created_at desc);

-- ---------------------------------------------------------------------------
-- adaptation_requests — "me interesa esta adaptación"
--
-- No guardamos quién lo pidió: no hay cuentas de usuario y no queremos datos
-- personales. Solo qué producto y qué adaptación, para saber qué se pide más.
-- ---------------------------------------------------------------------------

create table adaptation_requests (
  id             uuid primary key default gen_random_uuid(),
  product_id     text not null references products (id) on delete cascade,
  adaptation_id  text not null,
  contact_email  text,
  created_at     timestamptz not null default now()
);

create index adaptation_requests_product_idx on adaptation_requests (product_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Supabase activa RLS por defecto. Una tabla con RLS y sin políticas le
-- niega TODO a la clave anon, incluida la lectura, sin devolver error: la
-- API responde 0 filas como si el catálogo estuviera vacío. Por eso esto
-- va en el mismo archivo que crea las tablas: sin esto, el directorio
-- nunca funciona, aunque el seed haya cargado los datos bien.
--
-- El detalle completo de cada política está en `policies.sql`; acá va lo
-- mínimo para que la API responda apenas se corre este archivo.
-- ---------------------------------------------------------------------------

alter table providers enable row level security;
alter table products enable row level security;
alter table product_adaptation_needs enable row level security;
alter table provider_applications enable row level security;
alter table adaptation_requests enable row level security;

create policy "Lectura pública de negocios"
  on providers for select
  using (true);

create policy "Lectura pública de productos"
  on products for select
  using (true);

create policy "Lectura pública de necesidades cubiertas"
  on product_adaptation_needs for select
  using (true);

create policy "Cualquiera puede enviar una solicitud de negocio"
  on provider_applications for insert
  with check (true);

create policy "Cualquiera puede pedir una adaptación"
  on adaptation_requests for insert
  with check (true);
