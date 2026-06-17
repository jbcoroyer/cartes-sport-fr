import Link from 'next/link'
import CardItem from '@/components/cards/CardItem'
import type { CardWithDetails } from '@/lib/types/database'
import Reveal from '@/components/motion/Reveal'

interface OwnedCard {
  id: string
  card_number: string | null
  player_name: string
  image_url: string | null
  print_run: number | null
  products?: { id: string; name: string; season: string } | null
  teams?: { name: string; short_name: string | null } | null
  rarities?: { name: string; color_hex: string | null } | null
  price_snapshots?: { last_price: number | null; trend: string | null } | null
}

interface OwnedItem {
  id: string
  quantity: number
  cards: OwnedCard & {
    products?: { id: string; name: string; season: string } | null
  }
}

interface Props {
  items: OwnedItem[]
}

export default function CollectionByProduct({ items }: Props) {
  const byProduct = items.reduce<Record<string, { name: string; cards: OwnedItem[] }>>((acc, uc) => {
    const product = uc.cards?.products
    if (!product) return acc
    const key = product.id
    if (!acc[key]) acc[key] = { name: product.name, cards: [] }
    acc[key].cards.push(uc)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(byProduct).map(([productId, { name, cards }], sectionIdx) => (
        <Reveal key={productId} delay={sectionIdx * 0.08}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted font-medium truncate">{name}</p>
            <Link
              href={`/collection/${productId}`}
              className="text-2xs text-gold/70 hover:text-gold transition-colors shrink-0 ml-2"
            >
              Voir l&apos;album →
            </Link>
          </div>
          <div className="scroll-x -mx-5 md:-mx-8 lg:-mx-12 px-5 md:px-8 lg:px-12">
            {cards.slice(0, 12).map((uc) => {
              const card = uc.cards
              const normalized = {
                ...card,
                product_id: '',
                rarity_id: null,
                team_id: null,
                position: null,
                variant_type: '',
                is_autograph: false,
                is_rookie: false,
                parent_card_id: null,
                created_at: '',
                user_collections: { status: 'owned' as const, quantity: uc.quantity, condition: null },
              } as CardWithDetails
              return (
                <div key={uc.id} className="flex-none w-[120px]">
                  <CardItem card={normalized} compact showPrice={false} />
                </div>
              )
            })}
          </div>
        </Reveal>
      ))}
    </div>
  )
}
