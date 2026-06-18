-- Migration 2: Cards & collection enrichment

alter table public.cards
  add column if not exists card_type text;

update public.cards
set card_type = case
  when lower(variant_type) = 'base' then 'base'
  when lower(variant_type) in ('insert', 'numbered') then 'insert'
  else 'parallel'
end
where card_type is null;

alter table public.cards
  alter column card_type set default 'base';

update public.cards set card_type = 'base' where card_type is null;

alter table public.cards
  add constraint cards_card_type_check
  check (card_type in ('base', 'insert', 'parallel'));

alter table public.user_collections
  add column if not exists acquired_at timestamptz,
  add column if not exists acquisition_source text;

update public.user_collections
set acquired_at = coalesce(acquired_at, updated_at, created_at)
where status = 'owned' and acquired_at is null;

create table if not exists public.acquisition_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  acquired_at timestamptz not null default now(),
  source text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_acquisition_events_user on public.acquisition_events(user_id, acquired_at desc);

alter table public.acquisition_events enable row level security;

drop policy if exists "Users read own acquisition events" on public.acquisition_events;
create policy "Users read own acquisition events"
  on public.acquisition_events for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users insert own acquisition events" on public.acquisition_events;
create policy "Users insert own acquisition events"
  on public.acquisition_events for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Backfill acquisition events from existing owned cards
insert into public.acquisition_events (user_id, card_id, acquired_at, source, notes)
select uc.user_id, uc.card_id, coalesce(uc.acquired_at, uc.updated_at, uc.created_at), uc.acquisition_source, uc.notes
from public.user_collections uc
where uc.status = 'owned'
on conflict do nothing;

create or replace function public.log_acquisition_on_owned()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'owned' and (tg_op = 'INSERT' or old.status is distinct from 'owned') then
    if new.acquired_at is null then
      new.acquired_at := now();
    end if;
    insert into public.acquisition_events (user_id, card_id, acquired_at, source, notes)
    values (new.user_id, new.card_id, new.acquired_at, new.acquisition_source, new.notes)
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_collection_owned on public.user_collections;
create trigger on_collection_owned
  before insert or update on public.user_collections
  for each row execute function public.log_acquisition_on_owned();

-- Backfill product totals
update public.products p
set
  total_base = sub.base_count,
  total_master = sub.master_count
from (
  select
    product_id,
    count(*) filter (where card_type = 'base') as base_count,
    count(*) as master_count
  from public.cards
  group by product_id
) sub
where p.id = sub.product_id;

-- Populate product_teams from existing cards
insert into public.product_teams (product_id, team_id, sort_order)
select c.product_id, c.team_id, row_number() over (partition by c.product_id order by t.name)
from public.cards c
join public.teams t on t.id = c.team_id
where c.team_id is not null
group by c.product_id, c.team_id, t.name
on conflict do nothing;
