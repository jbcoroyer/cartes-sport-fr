import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAuthUser } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import BackButton from '@/components/ui/BackButton'
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
  const { supabase, user } = await getAuthUser()

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
    .select('id, product_id, card_number, player_name, parent_card_id, card_type, variant_type, print_run')
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

  const variantIds = group.variants.map((v) => v.id)
  const collectionsByCardId: Record<
    string,
    { status: CollectionStatus; photoUrl: string | null }
  > = {}

  let collectionMeta: {
    condition: string | null
    acquired_at: string | null
    notes: string | null
    acquisition_source: string | null
  } | null = null

  if (user && variantIds.length) {
    const { data: collections } = await supabase
      .from('user_collections')
      .select('card_id, status, photo_url, condition, acquired_at, notes, acquisition_source')
      .eq('user_id', user.id)
      .in('card_id', variantIds)

    for (const row of collections ?? []) {
      collectionsByCardId[row.card_id] = {
        status: row.status as CollectionStatus,
        photoUrl: row.photo_url,
      }
      if (row.card_id === cardId) {
        collectionMeta = {
          condition: row.condition,
          acquired_at: row.acquired_at,
          notes: row.notes,
          acquisition_source: row.acquisition_source,
        }
      }
    }
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
          <CardDetailClient
            variants={group.variants}
            initialCardId={cardId}
            teamName={team?.name}
            collectionsByCardId={collectionsByCardId}
            userId={user?.id}
            isLoggedIn={!!user}
          />

          <dl className="w-full space-y-3 text-sm type-body">
            {product && (
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted">Set</dt>
                <dd>{product.name}</dd>
              </div>
            )}
            {collectionMeta?.condition && (
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted">État</dt>
                <dd>
                  <span className="inline-flex w-8 h-8 rounded-full bg-accent-forest/10 text-accent-forest text-xs items-center justify-center type-subtitle">
                    {conditionLabels[collectionMeta.condition] ?? collectionMeta.condition}
                  </span>
                </dd>
              </div>
            )}
            {collectionMeta?.acquired_at && (
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted">Acquis le</dt>
                <dd className="font-data">
                  {new Date(collectionMeta.acquired_at).toLocaleDateString('fr-FR')}
                </dd>
              </div>
            )}
            {collectionMeta?.acquisition_source && (
              <div className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted">Source</dt>
                <dd>{collectionMeta.acquisition_source}</dd>
              </div>
            )}
            {collectionMeta?.notes && (
              <div className="pt-2">
                <dt className="text-muted mb-1">Note</dt>
                <dd className="text-ink/80 italic">{collectionMeta.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </main>
  )
}
