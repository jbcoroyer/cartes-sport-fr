import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/profile'
import CardGrid from '@/components/cards/CardGrid'
import BottomNav from '@/components/ui/BottomNav'
import SearchBar from '@/components/ui/SearchBar'
import FilterBar from '@/components/ui/FilterBar'

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

  // Chargement des produits pour le filtre
  const { data: products } = await supabase
    .from('products')
    .select('id, name, season')
    .order('season', { ascending: false })

  // Requête des cartes avec filtres (+ comptage total pour le header)
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

  const normalizedCards = (cards ?? []).map((card) => {
    const uc = card.user_collections as { status: string; quantity: number } | { status: string; quantity: number }[] | null
    const entry = Array.isArray(uc) ? uc[0] ?? null : uc
    return { ...card, user_collections: entry }
  })

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-border px-4 pt-safe-top pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold tracking-tight">
            Cartes Sport <span className="text-gold">FR</span>
          </h1>
          <span className="text-xs text-white/40">
            {countLabel}
          </span>
        </div>
        <SearchBar defaultValue={params.q} />
        <FilterBar
          products={products ?? []}
          activeProduct={params.product}
        />
      </header>

      {/* Grille */}
      <section className="px-4 pt-4">
        <CardGrid cards={normalizedCards} />
      </section>

      <BottomNav active="catalogue" />
    </main>
  )
}
