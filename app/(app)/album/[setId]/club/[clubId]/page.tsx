import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BackButton from '@/components/ui/BackButton'
import BinderView from '@/components/vestiaire/BinderView'
import VestiaireViewToggle from '@/components/vestiaire/VestiaireViewToggle'
import BinderSlot from '@/components/vestiaire/BinderSlot'
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
    .select('id, name, binder_slots_per_page')
    .eq('id', setId)
    .single()

  if (!team || !product) notFound()

  const { data: rawCards } = await supabase
    .from('cards')
    .select('id, card_number, player_name, position, card_type, variant_type, parent_card_id, product_id')
    .eq('product_id', setId)
    .eq('team_id', clubId)
    .order('card_number')

  let collectionMap = new Map<string, CollectionStatus>()
  if (user && rawCards?.length) {
    const { data: collections } = await supabase
      .from('user_collections')
      .select('card_id, status')
      .eq('user_id', user.id)
      .in('card_id', rawCards.map((c) => c.id))

    collectionMap = new Map(
      (collections ?? []).map((c) => [c.card_id, c.status as CollectionStatus]),
    )
  }

  const displayCards = getDisplayCards(rawCards ?? [])
  const binderCards = displayCards.map((card) => ({
    id: card.id,
    cardNumber: card.card_number,
    playerName: card.player_name,
    position: card.position ?? null,
    collectionStatus: collectionMap.get(card.id) ?? null,
  }))

  const crestUrl = resolveTeamCrestUrl(team.name, team.crest_cached_url ?? team.logo_url)
  const accent = team.color_primary ?? '#4A6278'

  const listNodes = binderCards.map((card) => (
    <Link
      key={card.id}
      href={`/carte/${card.id}?from=/album/${setId}/club/${clubId}`}
      className="flex items-center gap-4 p-3 rounded-clay border border-border bg-surface hover:shadow-clay-sm transition-shadow"
    >
      <BinderSlot
        cardId={card.id}
        cardNumber={card.cardNumber}
        playerName={card.playerName}
        position={card.position}
        isOwned={card.collectionStatus === 'owned'}
        collectionStatus={card.collectionStatus}
        userId={user?.id}
        isLoggedIn={!!user}
        compact
      />
      <div className="font-sans">
        <p className="font-medium">{card.playerName}</p>
        <p className="text-sm text-muted font-data">#{card.cardNumber}</p>
      </div>
    </Link>
  ))

  return (
    <main className="min-h-screen bg-museum">
      <div className="page-container py-8 md:py-12">
        <BackButton href={`/album/${setId}`} label={product.name} />

        <header
          className="mb-10 rounded-clay-lg overflow-hidden clay-card"
          style={{
            background: `linear-gradient(180deg, ${accent}18 0%, white 40%)`,
          }}
        >
          <div className="p-8 md:p-10 flex flex-col items-center text-center">
            {crestUrl ? (
              <Image
                src={crestUrl}
                alt=""
                width={96}
                height={96}
                className="object-contain mb-4 drop-shadow-clay"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-panel flex items-center justify-center text-3xl font-serif text-muted mb-4">
                {team.name[0]}
              </div>
            )}
            <h1 className="font-serif text-2xl md:text-3xl font-medium">{team.name}</h1>
            <p className="text-sm text-muted mt-2 font-sans">Vestiaire</p>
          </div>
        </header>

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
