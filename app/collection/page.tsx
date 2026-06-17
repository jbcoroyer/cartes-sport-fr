import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BottomNav from '@/components/ui/BottomNav'
import CollectionStats from '@/components/collection/CollectionStats'
import CollectionByProduct from '@/components/collection/CollectionByProduct'

export const metadata: Metadata = { title: 'Ma collection' }

export default async function CollectionPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/collection')

  // Complétion par produit
  const { data: completion } = await supabase
    .from('user_completion')
    .select('*')
    .eq('user_id', user.id)
    .order('completion_pct', { ascending: false })

  // Cartes possédées avec infos
  const { data: owned } = await supabase
    .from('user_collections')
    .select(`
      id, status, quantity, condition, updated_at,
      cards (
        id, card_number, player_name, image_url, variant_type, print_run,
        products ( id, name, season ),
        rarities ( name, level, color_hex ),
        teams ( name, short_name ),
        price_snapshots ( last_price, trend )
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'owned')
    .order('updated_at', { ascending: false })
    .limit(100)

  // Valeur totale estimée
  const totalValue = owned?.reduce((sum, uc) => {
    const snap = (uc.cards as { price_snapshots: { last_price: number | null } | null } | null)?.price_snapshots
    return sum + (snap?.last_price ?? 0) * (uc.quantity ?? 1)
  }, 0) ?? 0

  const totalOwned   = owned?.reduce((s, uc) => s + (uc.quantity ?? 1), 0) ?? 0
  const totalMissing = completion?.reduce((s, c) => s + (c.missing_count ?? 0), 0) ?? 0

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-border px-4 pt-safe-top pb-4">
        <h1 className="text-lg font-semibold">Ma collection</h1>
      </header>

      <div className="px-4 pt-5 space-y-6">
        {/* Stats globales */}
        <CollectionStats
          totalOwned={totalOwned}
          totalMissing={totalMissing}
          totalValue={totalValue}
        />

        {/* Progression par produit */}
        {(completion?.length ?? 0) > 0 && (
          <section>
            <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
              Progression par série
            </h2>
            <div className="space-y-3">
              {completion!.map((c) => (
                <div key={c.product_id} className="bg-surface border border-border rounded-card p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium leading-tight">{c.product_name}</p>
                    <span className="text-xs text-gold font-semibold ml-2 shrink-0">
                      {c.completion_pct ?? 0}%
                    </span>
                  </div>
                  {/* Barre de progression */}
                  <div className="h-1.5 bg-panel rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-500"
                      style={{ width: `${c.completion_pct ?? 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/40 mt-2">
                    {c.owned_count} / {c.total_cards} cartes
                    {(c.missing_count ?? 0) > 0 && (
                      <span className="text-missing ml-1">
                        · {c.missing_count} manquantes
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dernières cartes ajoutées */}
        {(owned?.length ?? 0) > 0 && (
          <CollectionByProduct items={owned ?? []} />
        )}

        {/* État vide */}
        {(owned?.length ?? 0) === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">🃏</span>
            <p className="text-white/60 text-sm mb-1">Aucune carte dans ta collection</p>
            <p className="text-white/30 text-xs">
              Scanne une carte ou parcours le catalogue pour commencer
            </p>
          </div>
        )}
      </div>

      <BottomNav active="collection" />
    </main>
  )
}
