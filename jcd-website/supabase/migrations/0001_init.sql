-- JCD site schema.
-- Public pages read published rows anonymously; every write is admin-only.
-- Admin identity is carried on public.admins, keyed to auth.users.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- admins
--
-- This table has to exist before is_admin(), because a `language sql` body is
-- parsed and validated at creation time.

create table public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  role       text not null default 'staff' check (role in ('owner', 'staff')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- helpers

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------- catalogue

create table public.collections (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  title_ar   text not null,
  sort_order int  not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title_ar       text not null,
  description_ar text,
  price_cents    int  not null check (price_cents >= 0),
  currency       text not null default 'LBP',
  stock          int  not null default 0 check (stock >= 0),
  status         text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  collection_id  uuid references public.collections (id) on delete set null,
  sort_order     int  not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index on public.products (status, sort_order);
create index on public.products (collection_id);

create table public.product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt_ar     text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index on public.product_images (product_id, sort_order);

-- ---------------------------------------------------------------- orders

create table public.orders (
  id             uuid primary key default gen_random_uuid(),
  reference      text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  customer_name  text not null,
  customer_email text,
  customer_phone text not null,
  address_ar     text,
  status         text not null default 'pending'
                 check (status in ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded')),
  subtotal_cents int not null default 0 check (subtotal_cents >= 0),
  currency       text not null default 'LBP',
  note           text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index on public.orders (status, created_at desc);

create table public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders (id) on delete cascade,
  product_id       uuid references public.products (id) on delete set null,
  -- denormalised so an order stays readable after the product changes
  title_ar         text not null,
  unit_price_cents int not null check (unit_price_cents >= 0),
  quantity         int not null check (quantity > 0)
);

create index on public.order_items (order_id);

-- ---------------------------------------------------------------- content

create table public.programs (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title_ar       text not null,
  summary_ar     text,
  body_ar        text,
  image_path     text,
  status         text not null default 'draft' check (status in ('draft', 'published')),
  sort_order     int  not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.events (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title_ar    text not null,
  summary_ar  text,
  image_path  text,
  location_ar text,
  starts_at   timestamptz,
  ends_at     timestamptz,
  status      text not null default 'draft' check (status in ('draft', 'published')),
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index on public.events (status, starts_at desc);

create table public.faqs (
  id          uuid primary key default gen_random_uuid(),
  question_ar text not null,
  answer_ar   text not null,
  status      text not null default 'draft' check (status in ('draft', 'published')),
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  author_ar   text not null,
  role_ar     text,
  quote_ar    text not null,
  status      text not null default 'draft' check (status in ('draft', 'published')),
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.subscribers (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  unsubscribed boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Singleton row of editable site-wide values (helpline number, etc).
create table public.site_settings (
  id            boolean primary key default true check (id),
  phone         text not null default '+961 1 234 567',
  helpline_ar   text not null default 'خط المساعدة - متاح 24/7',
  helpline_note_ar text not null default 'لا تتردد في الاتصال بنا. الاستشارة مجانية وسرية.',
  updated_at    timestamptz not null default now()
);

insert into public.site_settings (id) values (true) on conflict do nothing;

-- ---------------------------------------------------------------- triggers

do $$
declare t text;
begin
  foreach t in array array[
    'collections', 'products', 'orders', 'programs',
    'events', 'faqs', 'testimonials', 'site_settings'
  ]
  loop
    execute format(
      'create trigger %I_touch before update on public.%I
         for each row execute function public.touch_updated_at()', t, t);
  end loop;
end $$;

-- ---------------------------------------------------------------- RLS

alter table public.admins         enable row level security;
alter table public.collections    enable row level security;
alter table public.products       enable row level security;
alter table public.product_images enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.programs       enable row level security;
alter table public.events         enable row level security;
alter table public.faqs           enable row level security;
alter table public.testimonials   enable row level security;
alter table public.subscribers    enable row level security;
alter table public.site_settings  enable row level security;

-- An admin may read the admin list; nobody may write it from the client.
create policy admins_read on public.admins
  for select using (public.is_admin());

-- Published content is world-readable; admins see and change everything.
do $$
declare t text;
begin
  foreach t in array array['products', 'programs', 'events', 'faqs', 'testimonials']
  loop
    execute format(
      'create policy %I_public_read on public.%I
         for select using (status = ''published'')', t, t);
    execute format(
      'create policy %I_admin_all on public.%I
         for all using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

create policy collections_public_read on public.collections for select using (true);
create policy collections_admin_all   on public.collections for all
  using (public.is_admin()) with check (public.is_admin());

create policy product_images_public_read on public.product_images for select using (
  exists (select 1 from public.products p
          where p.id = product_id and p.status = 'published')
);
create policy product_images_admin_all on public.product_images for all
  using (public.is_admin()) with check (public.is_admin());

create policy site_settings_public_read on public.site_settings for select using (true);
create policy site_settings_admin_all   on public.site_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- Anyone may subscribe; only admins may read or manage the list.
create policy subscribers_insert on public.subscribers for insert with check (true);
create policy subscribers_admin  on public.subscribers for all
  using (public.is_admin()) with check (public.is_admin());

-- Orders are never readable from the browser. They are created and read
-- exclusively through server code holding the service-role key.
create policy orders_admin      on public.orders      for all
  using (public.is_admin()) with check (public.is_admin());
create policy order_items_admin on public.order_items for all
  using (public.is_admin()) with check (public.is_admin());
