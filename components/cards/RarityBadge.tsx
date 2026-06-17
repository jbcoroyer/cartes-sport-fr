// Mapping des rarités vers des couleurs fixes
const RARITY_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  'Base':              { bg: 'rgba(107,114,128,0.2)', text: '#9CA3AF', glow: 'rgba(107,114,128,0.3)' },
  'Écusson':           { bg: 'rgba(107,114,128,0.15)', text: '#6B7280', glow: 'rgba(107,114,128,0.25)' },
  'Crack':             { bg: 'rgba(168,85,247,0.2)', text: '#C084FC', glow: 'rgba(168,85,247,0.35)' },
  'Megacrack':         { bg: 'rgba(236,72,153,0.2)', text: '#F472B6', glow: 'rgba(236,72,153,0.35)' },
  'Invincible':        { bg: 'rgba(245,158,11,0.2)', text: '#FBBF24', glow: 'rgba(245,158,11,0.4)' },
  'Invincible Mythique':{ bg: 'rgba(245,158,11,0.25)', text: '#F59E0B', glow: 'rgba(245,158,11,0.45)' },
  'Momentum':          { bg: 'rgba(6,182,212,0.2)', text: '#22D3EE', glow: 'rgba(6,182,212,0.35)' },
  'Totem':             { bg: 'rgba(99,102,241,0.2)', text: '#818CF8', glow: 'rgba(99,102,241,0.35)' },
  'Diamant':           { bg: 'rgba(201,168,76,0.2)', text: '#C9A84C', glow: 'rgba(201,168,76,0.4)' },
  'Ange Gardien':      { bg: 'rgba(255,255,255,0.1)', text: '#E5E7EB', glow: 'rgba(255,255,255,0.2)' },
  'Air Force':         { bg: 'rgba(59,130,246,0.2)', text: '#60A5FA', glow: 'rgba(59,130,246,0.35)' },
  'Influenceur':       { bg: 'rgba(234,179,8,0.2)', text: '#FBBF24', glow: 'rgba(234,179,8,0.35)' },
  'Expert':            { bg: 'rgba(20,184,166,0.2)', text: '#2DD4BF', glow: 'rgba(20,184,166,0.35)' },
  'Édition Limitée':   { bg: 'rgba(201,168,76,0.25)', text: '#E8C96A', glow: 'rgba(201,168,76,0.4)' },
  'Panini Extra Gold': { bg: 'rgba(201,168,76,0.35)', text: '#C9A84C', glow: 'rgba(201,168,76,0.5)' },
  'Refractor':         { bg: 'rgba(255,255,255,0.08)', text: '#D1D5DB', glow: 'rgba(255,255,255,0.15)' },
  'Gold Refractor':    { bg: 'rgba(201,168,76,0.25)', text: '#C9A84C', glow: 'rgba(201,168,76,0.45)' },
  'Orange Refractor':  { bg: 'rgba(249,115,22,0.2)', text: '#FB923C', glow: 'rgba(249,115,22,0.35)' },
  'Red Refractor':     { bg: 'rgba(239,68,68,0.2)', text: '#F87171', glow: 'rgba(239,68,68,0.35)' },
  'Superfractor':      { bg: 'rgba(255,255,255,0.15)', text: '#FFFFFF', glow: 'rgba(255,255,255,0.3)' },
  'Chrome Autograph':  { bg: 'rgba(168,85,247,0.25)', text: '#C084FC', glow: 'rgba(168,85,247,0.4)' },
  'Golazo':            { bg: 'rgba(234,179,8,0.2)', text: '#FDE047', glow: 'rgba(234,179,8,0.35)' },
  'Wonderkids':        { bg: 'rgba(16,185,129,0.2)', text: '#34D399', glow: 'rgba(16,185,129,0.35)' },
  'Champion Clubs':    { bg: 'rgba(201,168,76,0.2)', text: '#C9A84C', glow: 'rgba(201,168,76,0.4)' },
  'Helix':             { bg: 'rgba(139,92,246,0.2)', text: '#A78BFA', glow: 'rgba(139,92,246,0.35)' },
}

const DEFAULT_STYLE = { bg: 'rgba(107,114,128,0.2)', text: '#9CA3AF', glow: 'rgba(107,114,128,0.25)' }

export function getRarityStyle(name: string, colorHex?: string | null) {
  const style = RARITY_COLORS[name] ?? DEFAULT_STYLE
  return {
    bg: colorHex ? `${colorHex}33` : style.bg,
    text: colorHex ?? style.text,
    glow: colorHex ? `${colorHex}55` : style.glow,
  }
}

interface Props {
  name: string
  colorHex?: string | null
  compact?: boolean
}

export default function RarityBadge({ name, colorHex, compact = false }: Props) {
  const style = getRarityStyle(name, colorHex)

  if (compact) {
    return (
      <span
        className="block w-2.5 h-2.5 rounded-full ring-1 ring-black/30"
        style={{ backgroundColor: style.text, boxShadow: `0 0 6px ${style.glow}` }}
        title={name}
      />
    )
  }

  return (
    <span
      className="inline-block text-[10px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {name}
    </span>
  )
}
