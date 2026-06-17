-- ============================================================
-- 005 — Storage bucket pour les couvertures de collections
-- ============================================================
-- Bucket "product-covers" : affiches produits (homepage, collection).
-- Lecture publique, écriture réservée au service role / connectés.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('product-covers', 'product-covers', true)
on conflict (id) do nothing;

drop policy if exists "Couvertures produits lisibles par tous" on storage.objects;
create policy "Couvertures produits lisibles par tous"
  on storage.objects for select
  using (bucket_id = 'product-covers');

drop policy if exists "Upload couvertures réservé aux connectés" on storage.objects;
create policy "Upload couvertures réservé aux connectés"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-covers');

drop policy if exists "Mise à jour couvertures réservée aux connectés" on storage.objects;
create policy "Mise à jour couvertures réservée aux connectés"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-covers');
