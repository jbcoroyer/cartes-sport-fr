import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import CollectionToggle from '@/components/collection/CollectionToggle'
import PriceHistory from '@/components/cards/PriceHistory'
import RarityBadge from '@/components/cards/RarityBadge'
import BackButton from '@/components/ui/BackButton'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('cards')
    .select('player_name, products(name)')
    .eq('id', id)
    .single()

  if (!data) return { title: 'Carte introuvable' }
  return {
    title: `${data.player_name} — ${(data.products as { name: string } | null)?.name}`,
  }
}

export default async function CardPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: card, error } = await supabase
    .from('cards')
    .select(`
      *,
      products ( id, name, season, series_types ( name, publishers ( name ) ) ),
      teams ( id, name, short_name, logo_url ),
      rarities ( id, name, level, color_hex, description ),
      price_snapshots ( * )
    `)
    .eq('id', id)
    .single()

  if (error || !card) notFound()

  // Récupère le statut de collection de l'utilisateur connecté
  const { data: { user } } = await supabase.auth.getUser()
  let userStatus = null
  if (user) {
    const { data: uc } = await supabase
      .from('user_collections')
      .select('status, quantity, condition')
      .eq('card_id', id)
      .eq('user_id', user.id)
      .single()
    userStatus = uc
  }

  const rarity = card.rarities as { name: string; color_hex: string | null; description: string | null } | null
  const team = card.teams as { name: string; short_name: string | null } | null
  const product = card.products as { name: string; season: string } | null
  const price = card.price_snapshots as { last_price: number | null; avg_price_30d: number | null; trend: string | null } | null

  return (
    <main className="min-h-screen pb-24">
      {/* Image de la carte */}
      <div className="relative bg-surface aspect-[3/4] max-h-72 flex items-center justify-center overflow-hidden">
        {card.image_url ? (
          <Image
            src={card.image_url}
            alt={card.player_name}
            fill
            className="object-contain p-4"
            priority
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-white/20">
            <span className="text-5xl">🃏</span>
            <span className="text-sm">Image non disponible</span>
          </div>
        )}

        {/* Badge rareté */}
        {rarity && (
          <div className="absolute top-3 right-3">
            <RarityBadge name={rarity.name} colorHex={rarity.color_hex} />
          </div>
        )}

        <BackButton />
      </div>

      {/* Infos */}
      <div className="px-4 pt-5 space-y-5">
        {/* Titre */}
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">
            {product?.name} · #{card.card_number}
          </p>
          <h1 className="text-2xl font-semibold">{card.player_name}</h1>
          {team && (
            <p className="text-sm text-white/60 mt-0.5">{team.name}</p>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {card.is_rookie && (
            <span className="px-2 py-0.5 bg-gold/10 text-gold border border-gold/30 rounded-full text-xs font-medium">
              Rookie
            </span>
          )}
          {card.is_autograph && (
            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full text-xs font-medium">
              Autographe
            </span>
          )}
          {card.print_run && (
            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-medium">
              /{card.print_run}
            </span>
          )}
          {card.position && (
            <span className="px-2 py-0.5 bg-panel text-white/50 border border-border rounded-full text-xs">
              {card.position}
            </span>
          )}
        </div>

        {/* Cote */}
        {price?.last_price && (
          <div className="bg-surface border border-border rounded-card p-4">
            <p className="text-xs text-white/40 mb-2">Cote de marché</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-semibold text-gold">
                {price.last_price.toFixed(2)} €
              </span>
              {price.trend && (
                <span className={`text-sm mb-1 ${
                  price.trend === 'up' ? 'text-owned' :
                  price.trend === 'down' ? 'text-missing' :
                  'text-white/40'
                }`}>
                  {price.trend === 'up' ? '↑' : price.trend === 'down' ? '↓' : '→'}
                </span>
              )}
            </div>
            {price.avg_price_30d && (
              <p className="text-xs text-white/40 mt-1">
                Moy. 30j : {price.avg_price_30d.toFixed(2)} €
              </p>
            )}
          </div>
        )}

        {/* Statut collection */}
        <CollectionToggle
          cardId={card.id}
          userId={user?.id ?? ''}
          initialStatus={userStatus?.status ?? null}
          initialQuantity={userStatus?.quantity ?? 1}
          isLoggedIn={!!user}
        />
      </div>
    </main>
  )
}
