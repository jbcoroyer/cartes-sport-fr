const PUBLISHER_COLORS: Record<string, string> = {
  Topps: '#4A6278',
  Panini: '#6B2D3E',
  default: '#8B6914',
}

export function getPublisherAccent(publisherName?: string | null): string {
  if (!publisherName) return PUBLISHER_COLORS.default
  for (const [key, color] of Object.entries(PUBLISHER_COLORS)) {
    if (key !== 'default' && publisherName.toLowerCase().includes(key.toLowerCase())) {
      return color
    }
  }
  return PUBLISHER_COLORS.default
}
