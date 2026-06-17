import Link from 'next/link'
import Image from 'next/image'
import { Check, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import type { CardWithDetails } from '@/lib/types/database'
import PremiumCard from './PremiumCard'
import RarityBadge from './RarityBadge'

interface Props {
  card: CardWithDetails
  compact?: boolean
  showPrice?: boolean
}

const STATUS_STYLES = {
  owned:   'border-owned/30 shadow-glow-owned',
  missing: 'border-missing/25',
  wanted:  'border-wanted/25 shadow-glow-wanted',
} as const

function TrendIcon({ trend }: { trend: string | null }) {
  if (!trend) return null
  if (trend === 'up') return <TrendingUp size={10} className="text-owned" />
  if (trend === 'down') return <TrendingDown size={10} className="text-missing" />
  return <Minus size={10} className="text-white/30" />
}

export default function CardItem({ card, compact = false, showPrice = true }: Props) {
  const rarity = card.rarities as { name: string; color_hex: string | null } | null
  const team   = card.teams   as { short_name: string | null; name: string } | null
  const price  = card.price_snapshots as { last_price: number | null; trend: string | null } | null
  const status = card.user_collections?.status ?? null

  return (
    <Link href={`/catalogue/${card.id}`} className="block">
      <PremiumCard
        rarityName={rarity?.name}
        rarityColorHex={rarity?.color_hex}
        className={status ? STATUS_STYLES[status] : ''}
        enableTilt={!compact}
        glowIntensity={compact ? 'low' : 'medium'}
      >
        <div className="relative aspect-[3/4] bg-panel/80 overflow-hidden">
          {card.image_url ? (
            <Image
              src={card.image_url}
              alt={card.player_name}
              fill
              sizes={compact ? '100px' : '(max-width: 640px) 45vw, 180px'}
              className="object-contain p-2"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/10 text-3xl">
              🃏
            </div>
          )}

          {rarity && (
            <div className="absolute top-2 right-2 z-10">
              <RarityBadge name={rarity.name} colorHex={rarity.color_hex} compact />
            </div>
          )}

          {status === 'owned' && (
            <div className="absolute top-2 left-2 z-10 w-5 h-5 rounded-full bg-owned flex items-center justify-center shadow-glow-owned">
              <Check size={11} strokeWidth={3} className="text-white" />
            </div>
          )}

          {card.print_run && (
            <div className="absolute bottom-2 left-2 text-[9px] text-cyan-400 font-mono bg-canvas/80 backdrop-blur-sm px-1.5 py-0.5 rounded">
              /{card.print_run}
            </div>
          )}
        </div>

        {!compact && (
          <div className="p-3 space-y-1">
            <p className="text-xs font-semibold leading-tight truncate">
              {card.player_name}
            </p>
            <p className="text-2xs text-white/40 truncate">
              {team?.short_name ?? team?.name ?? '—'}
            </p>

            {showPrice && price?.last_price && (
              <div className="flex items-center gap-1 pt-1">
                <span className="text-xs text-gold font-semibold">
                  {price.last_price.toFixed(2)} €
                </span>
                <TrendIcon trend={price.trend} />
              </div>
            )}
          </div>
        )}
      </PremiumCard>
    </Link>
  )
}
