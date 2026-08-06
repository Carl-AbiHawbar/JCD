-- Public submissions and the donations table.
--
-- Everything the public writes goes in through narrow RLS insert policies or a
-- security-definer function, so no service-role key needs to exist anywhere in
-- the app. Reads on all of these stay admin-only.

create table public.donations (
  id           uuid primary key default gen_random_uuid(),
  reference    text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  amount_cents int  not null check (amount_cents >= 0),
  currency     text not null default 'USD',
  donor_name   text,
  donor_email  text,
  donor_phone  text,
  note         text,
  status       text not null default 'pledged'
               check (status in ('pledged', 'received', 'cancelled')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index on public.donations (status, created_at desc);

create trigger donations_touch before update on public.donations
  for each row execute function public.touch_updated_at();

alter table public.donations enable row level security;

create policy donations_admin_all on public.donations
  for all using (public.is_admin()) with check (public.is_admin());

create policy donations_public_insert on public.donations
  for insert with check (status = 'pledged');

create policy assessments_public_insert on public.assessments
  for insert with check (true);

-- ------------------------------------------------------------------ orders
--
-- Orders are placed through this function rather than by direct insert, for
-- two reasons: the line prices are read from public.products inside the same
-- transaction, so the browser can only ever send ids and quantities; and the
-- order and its lines are written together, so a failure cannot leave an order
-- with no items behind.
--
-- Note the deliberate absence of a temporary table. An earlier version used
-- one and tripped pg_safeupdate ("DELETE requires a WHERE clause"), which is
-- enabled on Supabase.
create or replace function public.create_order(
  p_name    text,
  p_phone   text,
  p_email   text,
  p_address text,
  p_note    text,
  p_items   jsonb
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reference text;
  v_count     int;
  v_inserted  int;
begin
  if length(coalesce(trim(p_name), '')) < 2 then
    raise exception 'INVALID_NAME';
  end if;
  if length(coalesce(trim(p_phone), '')) < 6 then
    raise exception 'INVALID_PHONE';
  end if;

  select count(*) into v_count
  from jsonb_array_elements(p_items) i
  join public.products p
    on p.id = (i->>'productId')::uuid and p.status = 'published';

  if v_count = 0 then
    raise exception 'EMPTY_CART';
  end if;

  v_reference := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

  with wanted as (
    select (i->>'productId')::uuid as product_id,
           least(greatest((i->>'quantity')::int, 1), 99) as quantity
    from jsonb_array_elements(p_items) i
  ),
  lines as (
    select p.id as product_id, p.title_ar, p.price_cents as unit_price_cents,
           w.quantity, p.currency
    from wanted w
    join public.products p on p.id = w.product_id and p.status = 'published'
  ),
  totals as (
    select coalesce(sum(unit_price_cents * quantity), 0)::int as subtotal,
           coalesce(min(currency), 'USD') as currency
    from lines
  ),
  new_order as (
    insert into public.orders (
      reference, customer_name, customer_phone, customer_email,
      address_ar, note, subtotal_cents, currency, status
    )
    select v_reference, trim(p_name), trim(p_phone),
           nullif(trim(coalesce(p_email, '')), ''),
           nullif(trim(coalesce(p_address, '')), ''),
           nullif(trim(coalesce(p_note, '')), ''),
           t.subtotal, t.currency, 'pending'
    from totals t
    returning id
  )
  insert into public.order_items (
    order_id, product_id, title_ar, unit_price_cents, quantity
  )
  select n.id, l.product_id, l.title_ar, l.unit_price_cents, l.quantity
  from new_order n cross join lines l;

  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then
    raise exception 'EMPTY_CART';
  end if;

  return v_reference;
end;
$$;

revoke all on function public.create_order(text, text, text, text, text, jsonb) from public;
grant execute on function public.create_order(text, text, text, text, text, jsonb)
  to anon, authenticated;
