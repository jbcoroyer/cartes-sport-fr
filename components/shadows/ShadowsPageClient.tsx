'use client'

import { useState } from 'react'
import ShadowWall from '@/components/shadows/ShadowWall'
import type { CollectionStatus } from '@/lib/types/database'

interface Product {
  id: string
  name: string
}

interface CardRow {
  id: string
  cardNumber: string
  playerName: string
  position: string | null
  collectionStatus: CollectionStatus
  productId: string
}

interface Props {
  products: Product[]
  cards: CardRow[]
  userId: string
}

export default function ShadowsPageClient({ products, cards, userId }: Props) {
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id ?? '')

  const filtered = cards.filter((c) => c.productId === selectedProduct)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProduct(p.id)}
            className={`filter-tag ${selectedProduct === p.id ? 'active' : ''}`}
          >
            {p.name}
          </button>
        ))}
      </div>
      <ShadowWall cards={filtered} userId={userId} isLoggedIn />
    </div>
  )
}
