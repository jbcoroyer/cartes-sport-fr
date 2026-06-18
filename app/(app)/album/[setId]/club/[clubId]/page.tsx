import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BackButton from '@/components/ui/BackButton'
import ClubHeader from '@/components/album/ClubHeader'
import BinderView from '@/components/vestiaire/BinderView'
import VestiaireViewToggle from '@/components/vestiaire/VestiaireViewToggle'
import { getDisplayCards } from '@/lib/collection'
import { resolveTeamCrestUrl } from '@/lib/football-data/crest-overrides'
import type { CollectionStatus } from '@/lib/types/database'

interface Props {
  params: Promise<{ setId: string; clubId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clubId } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('teams').select('name').eq('id', clubId).single()
  return { title: data?.name ?? 'Vestiaire' }
}

export default async function VestiairePage({ params }: Props) {
  const { setId, clubId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: team } = await supabase
    .from('teams')
    .select('id, name, crest_cached_url, logo_url, color_primary, color_secondary')
    .eq('id', clubId)
    .single()

  const { data: product } = await supabase
    .from('products')
    .select(`
      id, name, season, binder_slots_per_page,
      series_types ( publishers ( name ) )
    `)
    .eq('id', setId)
    .single()

  if (!team || !product) notFound()

  const { data: rawCards } = await supabase
    .from('cards')
    .select('id, card_number, player_name, position, card_type, variant_type, parent_card_id, product_id')
    .eq('product_id', setId)
    .eq('team_id', clubId)
    .order('card_number')

  let collectionMap = new Map<string, { status: CollectionStatus; photoUrl: string | null }>()
  if (user && rawCards?.length) {
    const { data: collections } = await supabase
      .from('user_collections')
      .select('card_id, status, photo_url')
      .eq('user_id', user.id)
      .in('card_id', rawCards.map((c) => c.id))

    collectionMap = new Map(
      (collections ?? []).map((c) => [
        c.card_id,
        { status: c.status as CollectionStatus, photoUrl: c.photo_url },
      ]),
    )
  }

  const displayCards = getDisplayCards(rawCards ?? [])
  const binderCards = displayCards.map((card) => {
    const entry = collectionMap.get(card.id)
    return {
      id: card.id,
      cardNumber: card.card_number,
      playerName: card.player_name,
      position: card.position ?? null,
      variantType: card.variant_type,
      cardType: card.card_type,
      photoUrl: entry?.photoUrl ?? null,
      collectionStatus: entry?.status ?? null,
    }
  })

  const crestUrl = resolveTeamCrestUrl(team.name, team.crest_cached_url ?? team.logo_url)
  const accent = team.color_primary ?? '#4A6278'
  const ownedCards = binderCards.filter((c) => c.collectionStatus === 'owned').length
  const totalCards = binderCards.length

  const listNodes = binderCards.map((card) => {
    const isOwned = card.collectionStatus === 'owned'
    return (
      <Link
        key={card.id}
        href={`/carte/${card.id}?from=/album/${setId}/club/${clubId}`}
        className="collection-list-row"
      >
        <span
          className={`font-data text-sm w-10 shrink-0 text-right ${
            isOwned ? 'text-muted' : 'text-ghost'
          }`}
        >
          {card.cardNumber}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`type-subtitle truncate ${isOwned ? 'text-ink' : 'text-ghost'}`}>
            {card.playerName}
          </p>
          {card.position && (
            <p className={`type-caption mt-0.5 ${isOwned ? 'text-muted' : 'text-ghost/80'}`}>
              {card.position}
            </p>
          )}
        </div>
        <span
          className={`type-eyebrow text-[10px] shrink-0 ${
            isOwned ? 'text-accent-forest' : 'text-muted'
          }`}
        >
          {isOwned ? 'Possédée' : 'Manquante'}
        </span>
      </Link>
    )
  })

  return (
    <main className="min-h-screen bg-museum">
      <div className="page-container py-8 md:py-12">
        <BackButton href={`/album/${setId}`} label={product.name} />

        <ClubHeader
          teamName={team.name}
          productName={product.name}
          crestUrl={crestUrl}
          accentColor={accent}
          ownedCards={ownedCards}
          totalCards={totalCards}
        />

        <VestiaireViewToggle
          binderView={
            <BinderView
              cards={binderCards}
              slotsPerPage={product.binder_slots_per_page ?? 9}
              userId={user?.id}
              isLoggedIn={!!user}
              setId={setId}
              clubId={clubId}
            />
          }
          listCards={binderCards.map((c, i) => ({
            id: c.id,
            cardNumber: c.cardNumber,
            playerName: c.playerName,
            node: listNodes[i],
          }))}
        />
      </div>
    </main>
  )
}
