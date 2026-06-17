// Mapping des rarités vers des couleurs fixes
// (utilisé en fallback si color_hex n'est pas renseigné en BDD)
const RARITY_COLORS: Record<string, { bg: string; text: string }> = {
  'Base':              { bg: 'rgba(107,114,128,0.2)', text: '#9CA3AF' },
  'Écusson':           { bg: 'rgba(107,114,128,0.15)', text: '#6B7280' },
  'Crack':             { bg: 'rgba(168,85,247,0.2)', text: '#C084FC' },
  'Megacrack':         { bg: 'rgba(236,72,153,0.2)', text: '#F472B6' },
  'Invincible':        { bg: 'rgba(245,158,11,0.2)', text: '#FBBF24' },
  'Invincible Mythique':{ bg: 'rgba(245,158,11,0.25)', text: '#F59E0B' },
  'Momentum':          { bg: 'rgba(6,182,212,0.2)', text: '#22D3EE' },
  'Totem':             { bg: 'rgba(99,102,241,0.2)', text: '#818CF8' },
  'Diamant':           { bg: 'rgba(201,168,76,0.2)', text: '#C9A84C' },
  'Ange Gardien':      { bg: 'rgba(255,255,255,0.1)', text: '#E5E7EB' },
  'Air Force':         { bg: 'rgba(59,130,246,0.2)', text: '#60A5FA' },
  'Influenceur':       { bg: 'rgba(234,179,8,0.2)', text: '#FBBF24' },
  'Expert':            { bg: 'rgba(20,184,166,0.2)', text: '#2DD4BF' },
  'Édition Limitée':   { bg: 'rgba(201,168,76,0.25)', text: '#E8C96A' },
  'Panini Extra Gold': { bg: 'rgba(201,168,76,0.35)', text: '#C9A84C' },
  'Refractor':         { bg: 'rgba(255,255,255,0.08)', text: '#D1D5DB' },
  'Gold Refractor':    { bg: 'rgba(201,168,76,0.25)', text: '#C9A84C' },
  'Orange Refractor':  { bg: 'rgba(249,115,22,0.2)', text: '#FB923C' },
  'Red Refractor':     { bg: 'rgba(239,68,68,0.2)', text: '#F87171' },
  'Superfractor':      { bg: 'rgba(255,255,255,0.15)', text: '#FFFFFF' },
  'Chrome Autograph':  { bg: 'rgba(168,85,247,0.25)', text: '#C084FC' },
  'Golazo':            { bg: 'rgba(234,179,8,0.2)', text: '#FDE047' },
  'Wonderkids':        { bg: 'rgba(16,185,129,0.2)', text: '#34D399' },
  'Champion Clubs':    { bg: 'rgba(201,168,76,0.2)', text: '#C9A84C' },
  'Helix':             { bg: 'rgba(139,92,246,0.2)', text: '#A78BFA' },
}

const DEFAULT_STYLE = { bg: 'rgba(107,114,128,0.2)', text: '#9CA3AF' }

interface Props {
  name: string
  colorHex?: string | null
  compact?: boolean
}

export default function RarityBadge({ name, colorHex, compact = false }: Props) {
  const style = RARITY_COLORS[name] ?? DEFAULT_STYLE

  const bgColor = colorHex ? `${colorHex}33` : style.bg
  const textColor = colorHex ?? style.text

  if (compact) {
    // Version mini pour la grille
    return (
      <span
        className="block w-2 h-2 rounded-full ring-1 ring-black/20"
        style={{ backgroundColor: textColor }}
        title={name}
      />
    )
  }

  return (
    <span
      className="inline-block text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {name}
    </span>
  )
}
