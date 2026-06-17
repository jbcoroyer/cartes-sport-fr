-- Policies INSERT pour la création de cartes via /api/admin/cards

drop policy if exists "Connectés peuvent créer des clubs" on public.teams;
create policy "Connectés peuvent créer des clubs"
  on public.teams for insert
  to authenticated
  with check (true);

drop policy if exists "Connectés peuvent créer des raretés" on public.rarities;
create policy "Connectés peuvent créer des raretés"
  on public.rarities for insert
  to authenticated
  with check (true);

drop policy if exists "Connectés peuvent créer des cartes" on public.cards;
create policy "Connectés peuvent créer des cartes"
  on public.cards for insert
  to authenticated
  with check (true);
