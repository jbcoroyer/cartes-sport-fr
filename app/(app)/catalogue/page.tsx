import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/profile'
import CardGrid from '@/components/cards/CardGrid'
import PageHeader from '@/components/ui/PageHeader'
import SearchBar from '@/components/ui/SearchBar'
import FilterBar from '@/components/ui/FilterBar'
import Reveal from '@/components/motion/Reveal'
import type { CardWithDetails, CollectionStatus } from '@/lib/types/database'

export const metadata: Metadata = { title: 'Catalogue' }

interface Props {
  searchParams: Promise<{
    q?: string
    product?: string
    rarity?: string
    team?: string
  }>
}

export default async function CataloguePage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (user) await ensureProfile(supabase, user)

  const { data: products } = await supabase
    .from('products')
    .select('id, name, season')
    .order('season', { ascending: false })

  const buildFilters = <T extends { ilike: Function; eq: Function }>(q: T) => {
    let filtered = q
    if (params.q) {
      filtered = filtered.ilike('player_name', `%${params.q}%`)
    }
    if (params.product) {
      filtered = filtered.eq('product_id', params.product)
    }
    if (params.rarity) {
      filtered = filtered.eq('rarities.name', params.rarity)
    }
    return filtered
  }

  let cardsQuery = buildFilters(
    supabase
      .from('cards')
      .select(`
        id, card_number, player_name, position, variant_type,
        print_run, is_autograph, is_rookie, image_url,
        products ( id, name, season ),
        teams ( id, name, short_name, logo_url ),
        rarities ( id, name, level, color_hex ),
        price_snapshots ( last_price, trend ),
        user_collections ( status, quantity )
      `)
      .limit(48)
  )

  const countSelect = params.rarity
    ? 'id, rarities!inner(name)'
    : 'id'

  let countQuery = buildFilters(
    supabase
      .from('cards')
      .select(countSelect, { count: 'exact', head: true })
  )

  const [{ data: cards, error }, { count: totalCount, error: countError }] =
    await Promise.all([cardsQuery, countQuery])

  if (error) console.error('Erreur catalogue:', error)
  if (countError) console.error('Erreur comptage catalogue:', countError)

  const shown = cards?.length ?? 0
  const total = totalCount ?? shown
  const countLabel =
    total > shown
      ? `${shown.toLocaleString('fr-FR')} / ${total.toLocaleString('fr-FR')} cartes`
      : `${total.toLocaleString('fr-FR')} carte${total !== 1 ? 's' : ''}`

  const normalizedCards: CardWithDetails[] = (cards ?? []).map((card) => {
    const uc = card.user_collections as { status: string; quantity: number } | { status: string; quantity: number }[] | null
    const entry = Array.isArray(uc) ? uc[0] ?? null : uc
    return {
      ...card,
      user_collections: entry
        ? { status: entry.status as NonNullable<CollectionStatus>, quantity: entry.quantity, condition: null }
        : null,
    } as CardWithDetails
  })

  return (
    <main className="min-h-screen">
      <PageHeader
        title="Catalogue"
        subtitle="Cotes de marché"
        right={
          <span className="text-sm text-muted font-medium">
            {countLabel}
          </span>
        }
      >
        <div className="mt-4 space-y-0">
          <SearchBar defaultValue={params.q} />
          <FilterBar
            products={products ?? []}
            activeProduct={params.product}
          />
        </div>
      </PageHeader>

      <Reveal>
        <section className="page-container pt-8 md:pt-10 pb-10">
          <CardGrid cards={normalizedCards} />
        </section>
      </Reveal>
    </main>
  )
}
