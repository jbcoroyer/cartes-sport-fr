import Link from 'next/link'
import Image from 'next/image'
import type { CardWithDetails } from '@/lib/types/database'
import RarityBadge from './RarityBadge'

interface Props {
  card: CardWithDetails
}

// Couleurs des statuts de collection
const STATUS_STYLES = {
  owned:   'border-owned/40 bg-owned/5',
  missing: 'border-missing/40 bg-missing/5',
  wanted:  'border-wanted/40 bg-wanted/5',
} as const

// Indicateur de tendance prix
function TrendIcon({ trend }: { trend: string | null }) {
  if (!trend) return null
  return (
    <span className={`text-[10px] ${
      trend === 'up' ? 'text-owned' :
      trend === 'down' ? 'text-missing' :
      'text-white/30'
    }`}>
      {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '·'}
    </span>
  )
}

export default function CardItem({ card }: Props) {
  const rarity = card.rarities as { name: string; color_hex: string | null } | null
  const team   = card.teams   as { short_name: string | null; name: string } | null
  const price  = card.price_snapshots as { last_price: number | null; trend: string | null } | null
  const status = card.user_collections?.status ?? null

  return (
    <Link
      href={`/catalogue/${card.id}`}
      className={`card-item block ${status ? STATUS_STYLES[status] : ''}`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-panel overflow-hidden">
        {card.image_url ? (
          <Image
            src={card.image_url}
            alt={card.player_name}
            fill
            sizes="(max-width: 640px) 45vw, 180px"
            className="object-contain p-2"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/10 text-3xl">
            🃏
          </div>
        )}

        {/* Badge rareté */}
        {rarity && (
          <div className="absolute top-1.5 right-1.5">
            <RarityBadge name={rarity.name} colorHex={rarity.color_hex} compact />
          </div>
        )}

        {/* Indicateur de collection */}
        {status === 'owned' && (
          <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-owned flex items-center justify-center">
            <span className="text-[8px] text-white">✓</span>
          </div>
        )}

        {/* Numbered */}
        {card.print_run && (
          <div className="absolute bottom-1.5 left-1.5 text-[9px] text-cyan-400 font-mono bg-canvas/70 px-1 rounded">
            /{card.print_run}
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="p-2 space-y-0.5">
        <p className="text-[11px] font-medium leading-tight truncate">
          {card.player_name}
        </p>
        <p className="text-[10px] text-white/40 truncate">
          {team?.short_name ?? team?.name ?? '—'}
        </p>

        {/* Prix */}
        {price?.last_price && (
          <div className="flex items-center gap-1 pt-0.5">
            <span className="text-[11px] text-gold font-medium">
              {price.last_price.toFixed(2)} €
            </span>
            <TrendIcon trend={price.trend} />
          </div>
        )}
      </div>
    </Link>
  )
}
