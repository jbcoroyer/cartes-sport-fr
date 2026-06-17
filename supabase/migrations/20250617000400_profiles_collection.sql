-- Profils + collection indexée au profil (user_profiles.id = user_collections.user_id)

-- 1. user_id automatique à l'insertion si omis côté client
create or replace function public.set_collection_user_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists set_user_collections_user_id on public.user_collections;
create trigger set_user_collections_user_id
  before insert on public.user_collections
  for each row execute function public.set_collection_user_id();

-- 2. Profil créé à l'inscription avec pseudo + avatar OAuth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text;
  v_avatar text;
begin
  v_username := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    nullif(split_part(new.email, '@', 1), ''),
    'Collectionneur'
  );
  v_avatar := coalesce(
    nullif(new.raw_user_meta_data->>'avatar_url', ''),
    nullif(new.raw_user_meta_data->>'picture', '')
  );

  insert into public.user_profiles (id, username, avatar_url)
  values (new.id, v_username, v_avatar)
  on conflict (id) do update set
    username   = coalesce(user_profiles.username, excluded.username),
    avatar_url = coalesce(user_profiles.avatar_url, excluded.avatar_url),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Policy INSERT profil (secours si trigger absent)
drop policy if exists "Users can insert own profile" on public.user_profiles;
create policy "Users can insert own profile"
  on public.user_profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- 4. Rattrapage des profils existants sans pseudo
update public.user_profiles up
set
  username = coalesce(
    up.username,
    nullif(trim(u.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(u.raw_user_meta_data->>'name'), ''),
    nullif(split_part(u.email, '@', 1), ''),
    'Collectionneur'
  ),
  avatar_url = coalesce(
    up.avatar_url,
    nullif(u.raw_user_meta_data->>'avatar_url', ''),
    nullif(u.raw_user_meta_data->>'picture', '')
  ),
  updated_at = now()
from auth.users u
where u.id = up.id
  and (up.username is null or up.avatar_url is null);
