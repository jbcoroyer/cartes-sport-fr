export function shade(hex: string, amount: number): string {
  const h = hex.replace('#', '')
  const num = parseInt(h, 16)
  let r = (num >> 16) & 255
  let g = (num >> 8) & 255
  let b = num & 255
  r = Math.max(0, Math.min(255, r + amount))
  g = Math.max(0, Math.min(255, g + amount))
  b = Math.max(0, Math.min(255, b + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

export function packGradient(c1: string, c2: string): string {
  const c2Dark = shade(c2, -22)
  return `radial-gradient(140% 110% at 30% -5%, ${c1} 0%, ${c2} 72%, ${c2Dark} 100%)`
}

export type PackTheme = {
  c1: string
  c2: string
  silkLight: boolean
  isNew: boolean
  logo: 'panini' | 'topps'
}

function seasonStartYear(season: string): number | null {
  const match = season.match(/(20\d{2})/)
  return match ? Number(match[1]) : null
}

export function getPackTheme(
  name: string,
  season: string,
  publisher?: string | null,
): PackTheme {
  const combined = `${name} ${season}`.toLowerCase()
  const isTopps =
    publisher?.toLowerCase().includes('topps') || combined.includes('topps')
  const isAdrenalyn = combined.includes('adrenalyn')
  const startYear = seasonStartYear(season)
  const is2025 = startYear === 2025
  const is2024 = startYear === 2024

  if (isAdrenalyn && is2025) {
    return {
      c1: '#DD7C5E',
      c2: '#A9482F',
      silkLight: true,
      isNew: false,
      logo: 'panini',
    }
  }
  if (isTopps && is2025) {
    return {
      c1: '#3C3F58',
      c2: '#22243A',
      silkLight: true,
      isNew: true,
      logo: 'topps',
    }
  }
  if (isAdrenalyn && is2024) {
    return {
      c1: '#7FB29A',
      c2: '#4C7A65',
      silkLight: true,
      isNew: false,
      logo: 'panini',
    }
  }
  if (isTopps && is2024) {
    return {
      c1: '#F0CC82',
      c2: '#C99B3F',
      silkLight: false,
      isNew: false,
      logo: 'topps',
    }
  }

  return {
    c1: '#DD7C5E',
    c2: '#A9482F',
    silkLight: true,
    isNew: false,
    logo: isTopps ? 'topps' : 'panini',
  }
}

export function relativeLuminance(hex: string): number {
  const h = hex.replace('#', '')
  const num = parseInt(h, 16)
  const r = ((num >> 16) & 255) / 255
  const g = ((num >> 8) & 255) / 255
  const b = (num & 255) / 255
  const linear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

export function prefersLightText(hex: string): boolean {
  return relativeLuminance(hex) < 0.45
}

export function stripFilledCount(owned: number, pct: number): number {
  return Math.max(owned > 0 ? 1 : 0, Math.round((20 * pct) / 100))
}
