import { getInitials, getRarityGradient } from '@/lib/cardVisual'

interface Props {
  playerName: string
  rarityColorHex?: string | null
  cardNumber?: string | null
  size?: 'sm' | 'md' | 'lg'
  richDetails?: boolean
}

const FONT_SIZE: Record<NonNullable<Props['size']>, number> = {
  sm: 26,
  md: 42,
  lg: 60,
}

export default function CardMonogramArt({
  playerName,
  rarityColorHex,
  cardNumber,
  size = 'md',
  richDetails = false,
}: Props) {
  const initials = getInitials(playerName)
  const { light, mid, dark, bgFrom, bgTo } = getRarityGradient(rarityColorHex)
  const fontSize = FONT_SIZE[size]

  return (
    <div
      className="absolute inset-0"
      style={{ background: `linear-gradient(150deg, ${bgFrom} 0%, ${bgTo} 55%, #F7F6F3 100%)` }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(17,17,16,0.06)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(125deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 16%, transparent 32%, transparent 78%, rgba(255,255,255,0.4) 100%)',
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <span
          style={{
            fontSize,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            backgroundImage: `linear-gradient(180deg, ${light} 0%, ${mid} 50%, ${dark} 100%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {initials}
        </span>
      </div>

      {richDetails && cardNumber && (
        <div
          className="absolute top-0 left-3 text-[11px] font-medium font-mono px-2.5 py-1 rounded-b-lg bg-surface/90 border border-t-0 border-border text-ink"
        >
          #{cardNumber}
        </div>
      )}
    </div>
  )
}
