-- Photos personnelles des cartes possédées (user_collections.photo_url)

alter table public.user_collections
  add column if not exists photo_url text;

comment on column public.user_collections.photo_url is
  'URL publique de la photo personnelle de la carte (bucket card-photos)';

insert into storage.buckets (id, name, public)
values ('card-photos', 'card-photos', true)
on conflict (id) do nothing;

drop policy if exists "card photos public read" on storage.objects;
create policy "card photos public read"
  on storage.objects for select
  using (bucket_id = 'card-photos');

drop policy if exists "users upload own card photos" on storage.objects;
create policy "users upload own card photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'card-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users update own card photos" on storage.objects;
create policy "users update own card photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'card-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'card-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users delete own card photos" on storage.objects;
create policy "users delete own card photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'card-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
