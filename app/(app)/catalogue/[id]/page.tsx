import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TrendingDown, TrendingUp, Minus, Star, Pen, Hash, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import CollectionToggle from '@/components/collection/CollectionToggle'
import CardShowcase from '@/components/cards/CardShowcase'
import Reveal from '@/components/motion/Reveal'

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
    <main className="min-h-screen pb-32">
      <CardShowcase
        imageUrl={card.image_url}
        playerName={card.player_name}
        rarityName={rarity?.name}
        rarityColorHex={rarity?.color_hex}
      />

      <div className="page-container pt-8 md:pt-10 pb-32 space-y-6">
        <Reveal>
          <div>
            <p className="text-2xs text-white/40 uppercase tracking-wider mb-1.5">
              {product?.name} · #{card.card_number}
            </p>
            <h1 className="text-2xl font-bold tracking-tight">{card.player_name}</h1>
            {team && (
              <p className="text-sm text-white/50 mt-1">{team.name}</p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="flex flex-wrap gap-2">
            {card.is_rookie && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold border border-gold/25 rounded-full text-xs font-medium">
                <Star size={12} /> Rookie
              </span>
            )}
            {card.is_autograph && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/25 rounded-full text-xs font-medium">
                <Pen size={12} /> Autographe
              </span>
            )}
            {card.print_run && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 rounded-full text-xs font-medium">
                <Hash size={12} /> /{card.print_run}
              </span>
            )}
            {card.position && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-panel text-white/50 border border-border/60 rounded-full text-xs">
                <User size={12} /> {card.position}
              </span>
            )}
          </div>
        </Reveal>

        {price?.last_price && (
          <Reveal delay={0.1}>
            <div className="glass-panel rounded-xl2 p-5">
              <p className="text-2xs text-white/40 uppercase tracking-wider mb-3">Cote de marché</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-gradient-gold">
                  {price.last_price.toFixed(2)} €
                </span>
                {price.trend && (
                  <span className={`flex items-center gap-1 text-sm mb-1.5 ${
                    price.trend === 'up' ? 'text-owned' :
                    price.trend === 'down' ? 'text-missing' :
                    'text-white/40'
                  }`}>
                    {price.trend === 'up' ? <TrendingUp size={16} /> :
                     price.trend === 'down' ? <TrendingDown size={16} /> :
                     <Minus size={16} />}
                  </span>
                )}
              </div>
              {price.avg_price_30d && (
                <p className="text-xs text-white/40 mt-2">
                  Moyenne 30j : {price.avg_price_30d.toFixed(2)} €
                </p>
              )}
            </div>
          </Reveal>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-border/60 px-5 py-4 safe-bottom">
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
