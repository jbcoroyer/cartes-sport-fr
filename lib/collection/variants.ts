import type { Card } from '@/lib/types/database'

export type CardLike = Pick<
  Card,
  'id' | 'product_id' | 'card_number' | 'player_name' | 'parent_card_id' | 'card_type' | 'variant_type'
> & { print_run?: number | null; position?: string | null }

export type CardGroup = {
  templateId: string
  cardNumber: string
  playerName: string
  variants: CardLike[]
}

export function groupCardVariants(cards: CardLike[]): CardGroup[] {
  const byKey = new Map<string, CardGroup>()

  for (const card of cards) {
    const parentId = card.parent_card_id
    const key = parentId
      ? `parent:${parentId}`
      : `slot:${card.product_id}:${card.card_number}:${card.player_name}`

    const existing = byKey.get(key)
    if (existing) {
      existing.variants.push(card)
    } else {
      const templateId = parentId ?? card.id
      byKey.set(key, {
        templateId,
        cardNumber: card.card_number,
        playerName: card.player_name,
        variants: [card],
      })
    }
  }

  return Array.from(byKey.values()).map((group) => ({
    ...group,
    variants: group.variants.sort((a, b) => {
      if (a.card_type === 'base') return -1
      if (b.card_type === 'base') return 1
      return a.variant_type.localeCompare(b.variant_type)
    }),
  }))
}

export function getDisplayCards(cards: CardLike[]): CardLike[] {
  const groups = groupCardVariants(cards)
  return groups.map((g) => g.variants.find((v) => v.card_type === 'base') ?? g.variants[0])
}

export function getVariantLabel(card: CardLike): string {
  if (card.card_type === 'base') return 'Base'
  if (card.print_run) return `${card.variant_type} /${card.print_run}`
  return card.variant_type
}

export function formatVariantSuffix(suffix: string): string {
  return suffix
    .replace(/GoldRefractor/gi, 'Gold Refractor')
    .replace(/OrangeRefractor/gi, 'Orange Refractor')
    .replace(/RedRefractor/gi, 'Red Refractor')
    .replace(/Superfractor/gi, 'Superfractor')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
}

export function getBinderSlotLabels(
  cardNumber: string,
  variantType?: string | null,
  cardType?: string | null,
): { slotNumber: string; variant: string | null } {
  const dash = cardNumber.indexOf('-')
  const slotNumber = dash === -1 ? cardNumber : cardNumber.slice(0, dash)
  const suffix = dash !== -1 ? cardNumber.slice(dash + 1) : null

  if (cardType === 'base' && !suffix) {
    return { slotNumber, variant: null }
  }

  if (suffix && suffix !== slotNumber) {
    return { slotNumber, variant: formatVariantSuffix(suffix) }
  }

  if (variantType && variantType !== 'base' && variantType !== 'numbered') {
    return { slotNumber, variant: variantType }
  }

  return { slotNumber, variant: null }
}
