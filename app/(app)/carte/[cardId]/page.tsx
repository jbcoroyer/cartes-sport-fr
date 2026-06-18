import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BackButton from '@/components/ui/BackButton'
import CardSlot from '@/components/cards/CardSlot'
import CardDetailClient from '@/components/cards/CardDetailClient'
import { groupCardVariants } from '@/lib/collection'
import type { CollectionStatus } from '@/lib/types/database'

interface Props {
  params: Promise<{ cardId: string }>
  searchParams: Promise<{ from?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cardId } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('cards').select('player_name').eq('id', cardId).single()
  return { title: data?.player_name ?? 'Carte' }
}

export default async function CardDetailPage({ params, searchParams }: Props) {
  const { cardId } = await params
  const { from } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: card } = await supabase
    .from('cards')
    .select(`
      id, card_number, player_name, position, variant_type, card_type, print_run,
      product_id, parent_card_id,
      products ( id, name, season ),
      teams ( name ),
      rarities ( name, color_hex )
    `)
    .eq('id', cardId)
    .single()

  if (!card) notFound()

  const parentId = card.parent_card_id ?? card.id

  const { data: siblingCards } = await supabase
    .from('cards')
    .select('*')
    .eq('product_id', card.product_id)
    .or(`id.eq.${parentId},parent_card_id.eq.${parentId}`)

  const allRelated = siblingCards ?? [{
    id: card.id,
    product_id: card.product_id,
    card_number: card.card_number,
    player_name: card.player_name,
    parent_card_id: card.parent_card_id,
    card_type: card.card_type,
    variant_type: card.variant_type,
  }]
  const groups = groupCardVariants(allRelated)
  const group = groups.find((g) => g.variants.some((v) => v.id === cardId)) ?? {
    templateId: card.id,
    cardNumber: card.card_number,
    playerName: card.player_name,
    variants: [{ id: card.id, product_id: card.product_id, card_number: card.card_number, player_name: card.player_name, parent_card_id: card.parent_card_id, card_type: card.card_type, variant_type: card.variant_type }],
  }

  let collection: {
    status: CollectionStatus
    condition: string | null
    acquired_at: string | null
    notes: string | null
    acquisition_source: string | null
  } | null = null

  if (user) {
    const { data: uc } = await supabase
      .from('user_collections')
      .select('status, condition, acquired_at, notes, acquisition_source')
      .eq('user_id', user.id)
      .eq('card_id', cardId)
      .maybeSingle()

    collection = uc
  }

  const team = card.teams as { name: string } | null
  const product = card.products as { name: string; season: string } | null
  const backHref = from ?? (product ? `/album/${card.product_id}` : '/')

  const conditionLabels: Record<string, string> = {
    mint: 'Mint',
    near_mint: 'NM',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
  }

  return (
    <main className="min-h-screen bg-museum">
      <div className="page-container py-8 md:py-12 max-w-lg mx-auto">
        <BackButton href={backHref} label="Retour" />

        <div className="flex flex-col items-center gap-8 mt-6">
          <CardSlot size="lg">
            <span className="font-data text-sm text-muted">#{card.card_number}</span>
            <div>
              <h1 className="font-serif text-xl font-medium leading-tight">{card.player_name}</h1>
              {team && <p className="text-sm text-muted mt-1 font-sans">{team.name}</p>}
              {card.position && (
                <p className="text-xs text-muted font-sans">{card.position}</p>
              )}
            </div>
          </CardSlot>

          <CardDetailClient
            variants={group.variants}
            initialCardId={cardId}
            userId={user?.id}
            isLoggedIn={!!user}
            initialStatus={collection?.status ?? null}
          />

          <dl className="w-full space-y-3 text-sm font-sans">
            {product && (
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted">Set</dt>
                <dd>{product.name}</dd>
              </div>
            )}
            {collection?.condition && (
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted">État</dt>
                <dd>
                  <span className="inline-flex w-8 h-8 rounded-full bg-accent-forest/10 text-accent-forest text-xs items-center justify-center font-medium">
                    {conditionLabels[collection.condition] ?? collection.condition}
                  </span>
                </dd>
              </div>
            )}
            {collection?.acquired_at && (
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted">Acquis le</dt>
                <dd className="font-data">
                  {new Date(collection.acquired_at).toLocaleDateString('fr-FR')}
                </dd>
              </div>
            )}
            {collection?.acquisition_source && (
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted">Source</dt>
                <dd>{collection.acquisition_source}</dd>
              </div>
            )}
            {collection?.notes && (
              <div className="pt-2">
                <dt className="text-muted mb-1">Note</dt>
                <dd className="text-ink/80 italic">{collection.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </main>
  )
}
