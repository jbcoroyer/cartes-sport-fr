-- Migration 1: Sets & clubs enrichment

alter table public.products
  add column if not exists total_base int,
  add column if not exists total_master int,
  add column if not exists binder_slots_per_page int not null default 9;

alter table public.teams
  add column if not exists external_id text,
  add column if not exists color_primary text,
  add column if not exists color_secondary text,
  add column if not exists crest_cached_url text;

create table if not exists public.product_teams (
  product_id uuid not null references public.products(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  sort_order int not null default 0,
  group_phase text,
  primary key (product_id, team_id)
);

create index if not exists idx_product_teams_product on public.product_teams(product_id, sort_order);

alter table public.product_teams enable row level security;

drop policy if exists "Anyone can read product_teams" on public.product_teams;
create policy "Anyone can read product_teams"
  on public.product_teams for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can manage product_teams" on public.product_teams;
create policy "Authenticated can manage product_teams"
  on public.product_teams for all
  to authenticated
  using (true)
  with check (true);

-- Storage bucket for team crests
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'team-crests',
  'team-crests',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do nothing;

drop policy if exists "Public read team crests" on storage.objects;
create policy "Public read team crests"
  on storage.objects for select
  to public
  using (bucket_id = 'team-crests');

drop policy if exists "Authenticated upload team crests" on storage.objects;
create policy "Authenticated upload team crests"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'team-crests');

drop policy if exists "Authenticated update team crests" on storage.objects;
create policy "Authenticated update team crests"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'team-crests');

drop policy if exists "Authenticated select team crests" on storage.objects;
create policy "Authenticated select team crests"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'team-crests');
