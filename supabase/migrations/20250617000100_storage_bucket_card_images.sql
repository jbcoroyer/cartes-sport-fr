-- ============================================================
-- 003 — Storage bucket pour les images de cartes
-- ============================================================
-- Crée le bucket "card-images" et ses policies d'accès.
--
-- Modèle d'accès :
--   - Lecture : publique (les images du catalogue sont visibles par tous)
--   - Écriture : réservée aux utilisateurs connectés
-- ============================================================

insert into storage.buckets (id, name, public)
values ('card-images', 'card-images', true)
on conflict (id) do nothing;

drop policy if exists "Images cartes lisibles par tous" on storage.objects;
create policy "Images cartes lisibles par tous"
  on storage.objects for select
  using (bucket_id = 'card-images');

drop policy if exists "Upload images réservé aux connectés" on storage.objects;
create policy "Upload images réservé aux connectés"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'card-images');

drop policy if exists "Mise à jour images réservée aux connectés" on storage.objects;
create policy "Mise à jour images réservée aux connectés"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'card-images');

-- Permet l'upload admin : mise à jour de image_url par les connectés
drop policy if exists "Connectés peuvent mettre à jour les cartes" on public.cards;
create policy "Connectés peuvent mettre à jour les cartes"
  on public.cards for update
  to authenticated
  using (true)
  with check (true);
