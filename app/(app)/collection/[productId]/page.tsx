import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BackButton from '@/components/ui/BackButton'
import CircularProgress from '@/components/ui/CircularProgress'
import AlbumGrid, { type AlbumCard } from '@/components/collection/AlbumGrid'
import SeriesPills from '@/components/collection/SeriesPills'
import Reveal from '@/components/motion/Reveal'
import type { CollectionStatus } from '@/lib/types/database'

interface Props {
  params: Promise<{ productId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('name')
    .eq('id', productId)
    .single()

  return { title: data?.name ?? 'Album' }
}

export default async function AlbumPage({ params }: Props) {
  const { productId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?redirect=/collection/${productId}`)

  const { data: product } = await supabase
    .from('products')
    .select('id, name, season, total_cards')
    .eq('id', productId)
    .single()

  if (!product) notFound()

  const [{ data: completion }, { data: allSeries }, { data: cards }] = await Promise.all([
    supabase
      .from('user_completion')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single(),
    supabase
      .from('user_completion')
      .select('product_id, product_name, completion_pct')
      .eq('user_id', user.id)
      .order('completion_pct', { ascending: false }),
    supabase
      .from('cards')
      .select(`
        id, card_number, player_name, position, variant_type,
        print_run, is_autograph, is_rookie, image_url, product_id,
        products ( id, name, season ),
        teams ( id, name, short_name, logo_url ),
        rarities ( id, name, level, color_hex ),
        price_snapshots ( last_price, trend ),
        user_collections ( status, quantity )
      `)
      .eq('product_id', productId)
      .order('card_number', { ascending: true }),
  ])

  const albumCards: AlbumCard[] = (cards ?? []).map((card) => {
    const uc = card.user_collections as
      | { status: CollectionStatus; quantity: number }
      | { status: CollectionStatus; quantity: number }[]
      | null
    const entry = Array.isArray(uc) ? uc[0] ?? null : uc

    return {
      id: card.id,
      card_number: card.card_number,
      player_name: card.player_name,
      image_url: card.image_url,
      print_run: card.print_run,
      products: card.products,
      teams: card.teams,
      rarities: card.rarities,
      price_snapshots: card.price_snapshots,
      collectionStatus: entry?.status ?? null,
      quantity: entry?.quantity ?? 1,
    }
  })

  const ownedValue = albumCards
    .filter((c) => c.collectionStatus === 'owned')
    .reduce((sum, c) => {
      const price = (c.price_snapshots as { last_price: number | null } | null)?.last_price ?? 0
      return sum + price * c.quantity
    }, 0)

  const pct = completion?.completion_pct ?? 0
  const ownedCount = completion?.owned_count ?? 0
  const totalCards = completion?.total_cards ?? product.total_cards ?? albumCards.length

  return (
    <main className="min-h-screen bg-canvas">
        <header className="sticky top-14 md:top-16 z-40 bg-canvas border-b border-border">
          <div className="page-container py-6">
            <div className="flex items-start gap-4 mb-5">
              <BackButton href="/collection" />
              <div className="flex-1 min-w-0">
                <p className="text-2xs text-muted uppercase tracking-wider">{product.season}</p>
                <h1 className="text-xl md:text-2xl font-semibold leading-tight tracking-tight truncate mt-1">{product.name}</h1>
              </div>
              <CircularProgress value={pct} size={56} strokeWidth={3} />
            </div>

            <div className="flex items-center gap-4 text-sm text-muted mb-5">
              <span>
                <span className="text-ink font-medium">{ownedCount}</span> / {totalCards} cartes
              </span>
              {ownedValue > 0 && (
                <span>
                  Valeur : <span className="text-ink font-medium">{ownedValue.toFixed(0)} €</span>
                </span>
              )}
              {(completion?.missing_count ?? 0) > 0 && (
                <span className="text-missing/80">{completion?.missing_count} manquantes</span>
              )}
            </div>

            <SeriesPills series={allSeries ?? []} activeProductId={productId} />
          </div>
        </header>

      <div className="page-container pt-8 md:pt-10 pb-10">
        <Reveal>
          <AlbumGrid cards={albumCards} />
        </Reveal>
      </div>
    </main>
  )
}
