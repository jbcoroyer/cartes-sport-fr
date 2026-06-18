import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BackButton from '@/components/ui/BackButton'
import ShadowsPageClient from '@/components/shadows/ShadowsPageClient'
import { getDisplayCards } from '@/lib/collection'
import type { CollectionStatus } from '@/lib/types/database'

export const metadata: Metadata = { title: 'Mur des Ombres' }

export default async function ShadowsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/profil/ombres')

  const { data: products } = await supabase
    .from('products')
    .select('id, name')
    .eq('is_active', true)
    .order('season', { ascending: false })

  const { data: rawCards } = await supabase
    .from('cards')
    .select('id, card_number, player_name, position, card_type, variant_type, parent_card_id, product_id')
    .in('product_id', (products ?? []).map((p) => p.id))

  const { data: collections } = await supabase
    .from('user_collections')
    .select('card_id, status')
    .eq('user_id', user.id)

  const collectionMap = new Map(
    (collections ?? []).map((c) => [c.card_id, c.status as CollectionStatus]),
  )

  const cardsByProduct = new Map<string, typeof rawCards>()
  for (const card of rawCards ?? []) {
    const list = cardsByProduct.get(card.product_id) ?? []
    list.push(card)
    cardsByProduct.set(card.product_id, list)
  }

  const allDisplayCards: {
    id: string
    cardNumber: string
    playerName: string
    position: string | null
    collectionStatus: CollectionStatus
    productId: string
  }[] = []

  for (const [productId, productCards] of cardsByProduct) {
    if (!productCards) continue
    for (const card of getDisplayCards(productCards)) {
      allDisplayCards.push({
        id: card.id,
        cardNumber: card.card_number,
        playerName: card.player_name,
        position: card.position ?? null,
        collectionStatus: collectionMap.get(card.id) ?? null,
        productId,
      })
    }
  }

  return (
    <main className="min-h-screen bg-museum">
      <div className="page-container py-10 md:py-14">
        <BackButton href="/profil" label="Profil" />
        <header className="mt-6 mb-10">
          <h1 className="font-serif text-display-sm font-medium">Mur des Ombres</h1>
          <p className="text-muted mt-2 font-sans max-w-lg">
            Les cartes manquantes — silhouettes qui attendent d&apos;être acquises.
          </p>
        </header>
        <ShadowsPageClient
          products={products ?? []}
          cards={allDisplayCards}
          userId={user.id}
        />
      </div>
    </main>
  )
}
