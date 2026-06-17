/**
 * Utilitaires pour le rendu visuel généré des cartes sans photo.
 * Tout est calculé depuis player_name + rarities.color_hex.
 */

const DEFAULT_HEX = '#6B7280'

/** URLs du bucket card-images = placeholders sauf uploads admin (`{cardId}.ext`). */
export function hasRealCardImage(
  imageUrl: string | null | undefined,
  cardId?: string,
): boolean {
  if (!imageUrl) return false

  if (!imageUrl.includes('/card-images/')) return true

  if (cardId) {
    const filename = imageUrl.split('/card-images/')[1]?.split('?')[0] ?? ''
    if (filename.startsWith(`${cardId}.`)) return true
  }

  return false
}

/** Extrait 1-2 initiales depuis un nom de joueur. */
export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  const first = parts[0][0]
  const last = parts[parts.length - 1][0]
  return `${first}${last}`.toUpperCase()
}

/** Éclaircit (percent > 0) ou assombrit (percent < 0) une couleur hex. */
export function shadeHex(hex: string, percent: number): string {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean
  const num = parseInt(full, 16)

  let r = (num >> 16) & 0xff
  let g = (num >> 8) & 0xff
  let b = num & 0xff

  const amt = Math.round(2.55 * percent)
  r = Math.max(0, Math.min(255, r + amt))
  g = Math.max(0, Math.min(255, g + amt))
  b = Math.max(0, Math.min(255, b + amt))

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export interface RarityGradient {
  light: string
  mid: string
  dark: string
  bgFrom: string
  bgTo: string
}

/** Dérive un jeu de teintes cohérent depuis la seule couleur de rareté. */
export function getRarityGradient(colorHex?: string | null): RarityGradient {
  const base = colorHex || DEFAULT_HEX
  return {
    light: shadeHex(base, 40),
    mid: base,
    dark: shadeHex(base, -35),
    bgFrom: shadeHex(base, 55),
    bgTo: shadeHex(base, 25),
  }
}
