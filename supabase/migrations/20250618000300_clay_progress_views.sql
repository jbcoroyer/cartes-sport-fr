-- Migration 4: Progress views

create or replace view public.user_set_progress as
select
  uc.user_id,
  p.id as product_id,
  p.name as product_name,
  p.season,
  coalesce(p.total_base, count(*) filter (where c.card_type = 'base')) as base_total,
  coalesce(p.total_master, count(*)) as master_total,
  count(*) filter (where c.card_type = 'base' and uc.status = 'owned') as base_owned,
  count(*) filter (where uc.status = 'owned') as master_owned,
  round(
    100.0 * count(*) filter (where c.card_type = 'base' and uc.status = 'owned')
    / nullif(coalesce(p.total_base, count(*) filter (where c.card_type = 'base')), 0),
    1
  ) as pct_base,
  round(
    100.0 * count(*) filter (where uc.status = 'owned')
    / nullif(coalesce(p.total_master, count(*)), 0),
    1
  ) as pct_master,
  max(uc.acquired_at) filter (where uc.status = 'owned') as last_acquired_at
from public.products p
join public.cards c on c.product_id = p.id
left join public.user_collections uc on uc.card_id = c.id
group by uc.user_id, p.id, p.name, p.season, p.total_base, p.total_master;

create or replace view public.user_club_progress as
select
  uc.user_id,
  p.id as product_id,
  t.id as team_id,
  t.name as team_name,
  t.short_name,
  t.crest_cached_url,
  t.logo_url,
  t.color_primary,
  t.color_secondary,
  count(*) as total_cards,
  count(*) filter (where uc.status = 'owned') as owned_cards,
  round(
    100.0 * count(*) filter (where uc.status = 'owned') / nullif(count(*), 0),
    1
  ) as pct_owned
from public.products p
join public.cards c on c.product_id = p.id
join public.teams t on t.id = c.team_id
left join public.user_collections uc on uc.card_id = c.id and uc.user_id is not null
group by uc.user_id, p.id, t.id, t.name, t.short_name, t.crest_cached_url, t.logo_url, t.color_primary, t.color_secondary;

-- Simpler club progress for anonymous / per-user queries
create or replace view public.product_club_totals as
select
  c.product_id,
  c.team_id,
  count(*) as total_cards,
  count(*) filter (where c.card_type = 'base') as base_cards
from public.cards c
where c.team_id is not null
group by c.product_id, c.team_id;
