import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
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

  // Chargement des produits pour le filtre
  const { data: products } = await supabase
    .from('products')
    .select('id, name, season')
    .order('season', { ascending: false })

  // Requête des cartes avec filtres
  let query = supabase
    .from('cards')
    .select(`
      id, card_number, player_name, position, variant_type,
      print_run, is_autograph, is_rookie, image_url,
      products ( id, name, season ),
      teams ( id, name, short_name, logo_url ),
      rarities ( id, name, level, color_hex ),
      price_snapshots ( last_price, trend )
    `)
    .limit(48)

  if (params.q) {
    query = query.ilike('player_name', `%${params.q}%`)
  }
  if (params.product) {
    query = query.eq('product_id', params.product)
  }
  if (params.rarity) {
    query = query.eq('rarities.name', params.rarity)
  }

  const { data: cards, error } = await query

  if (error) console.error('Erreur catalogue:', error)

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-border px-4 pt-safe-top pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold tracking-tight">
            Cartes Sport <span className="text-gold">FR</span>
          </h1>
          <span className="text-xs text-white/40">
            {cards?.length ?? 0} cartes
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
        <CardGrid cards={cards ?? []} />
      </section>

      <BottomNav active="catalogue" />
    </main>
  )
}
