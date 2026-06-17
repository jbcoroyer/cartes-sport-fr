'use client'

import { useState } from 'react'
import CardItem from '@/components/cards/CardItem'
import SlotCard from './SlotCard'
import type { CardWithDetails, CollectionStatus } from '@/lib/types/database'

export type AlbumFilter = 'all' | 'owned' | 'missing' | 'wanted'

export interface AlbumCard {
  id: string
  card_number: string | null
  player_name: string
  image_url: string | null
  print_run: number | null
  products: CardWithDetails['products']
  teams: CardWithDetails['teams']
  rarities: CardWithDetails['rarities']
  price_snapshots: { last_price: number | null; trend: string | null } | null
  collectionStatus: CollectionStatus | null
  quantity: number
}

interface Props {
  cards: AlbumCard[]
}

const FILTERS: { id: AlbumFilter; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'owned', label: 'Possédées' },
  { id: 'missing', label: 'Manquantes' },
  { id: 'wanted', label: 'Souhaitées' },
]

export default function AlbumGrid({ cards }: Props) {
  const [filter, setFilter] = useState<AlbumFilter>('all')

  const filtered = cards.filter((card) => {
    if (filter === 'all') return true
    if (filter === 'owned') return card.collectionStatus === 'owned'
    if (filter === 'missing') return card.collectionStatus === 'missing' || card.collectionStatus === null
    if (filter === 'wanted') return card.collectionStatus === 'wanted'
    return true
  })

  const counts = {
    all: cards.length,
    owned: cards.filter((c) => c.collectionStatus === 'owned').length,
    missing: cards.filter((c) => c.collectionStatus === 'missing' || c.collectionStatus === null).length,
    wanted: cards.filter((c) => c.collectionStatus === 'wanted').length,
  }

  return (
    <div className="space-y-5">
      <div className="segment-control">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`segment-item ${filter === f.id ? 'active' : ''}`}
          >
            {f.label} ({counts[f.id]})
          </button>
        ))}
      </div>

      <div className="album-grid">
        {filtered.map((card) => {
          if (card.collectionStatus === 'owned') {
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
              user_collections: {
                status: 'owned' as const,
                quantity: card.quantity,
                condition: null,
              },
            } as unknown as CardWithDetails
            return (
              <div key={card.id}>
                <CardItem card={normalized} compact showPrice={false} />
              </div>
            )
          }

          return (
            <SlotCard
              key={card.id}
              cardId={card.id}
              cardNumber={card.card_number}
              playerName={card.player_name}
              status={card.collectionStatus}
            />
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-white/40 py-12">
          Aucune carte dans ce filtre
        </p>
      )}
    </div>
  )
}
