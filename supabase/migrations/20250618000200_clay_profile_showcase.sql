-- Migration 3: Profile & showcase

alter table public.user_profiles
  add column if not exists favorite_team_id uuid references public.teams(id) on delete set null,
  add column if not exists is_public boolean not null default false,
  add column if not exists showcase_public boolean not null default false,
  add column if not exists notify_threshold int not null default 90;

create table if not exists public.user_showcase (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  grid_position smallint not null check (grid_position >= 0 and grid_position <= 8),
  created_at timestamptz not null default now(),
  primary key (user_id, grid_position),
  unique (user_id, card_id)
);

alter table public.user_showcase enable row level security;

drop policy if exists "Users manage own showcase" on public.user_showcase;
create policy "Users manage own showcase"
  on public.user_showcase for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Public read public showcases" on public.user_showcase;
create policy "Public read public showcases"
  on public.user_showcase for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.user_profiles up
      where up.id = user_showcase.user_id
        and up.showcase_public = true
    )
  );
