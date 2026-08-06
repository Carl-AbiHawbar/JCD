-- Volunteer readiness assessment submissions.
--
-- Anyone may submit; only admins may read. Scores are written by the server
-- after recomputing them from the answers, never taken from the client.

create table public.assessments (
  id              uuid primary key default gen_random_uuid(),
  reference       text not null unique,
  score           int  not null,
  max_score       int  not null,
  percentage      int  not null check (percentage between 0 and 100),
  level           text not null check (level in
                    ('blocked', 'high', 'good', 'developing', 'limited')),
  status_ar       text not null,
  preferred_track text not null,
  -- full per-question detail, as returned by computeResult()
  answers         jsonb not null,
  strengths       jsonb not null,
  development     jsonb not null,
  reviewed        boolean not null default false,
  created_at      timestamptz not null default now()
);

create index on public.assessments (created_at desc);
create index on public.assessments (level);
create index on public.assessments (reviewed);

alter table public.assessments enable row level security;

-- Admin-only reads. The anonymous insert policy that lets the public submit an
-- assessment is added in 0003, alongside the other public-write policies.
create policy assessments_admin_all on public.assessments
  for all using (public.is_admin()) with check (public.is_admin());
