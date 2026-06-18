'use client'

import { useEffect, useState } from 'react'
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
  variantType?: string | null
  cardType?: string | null
  collectionStatus: CollectionStatus
  productId: string
}

interface Props {
  products: Product[]
  userId: string
}

export default function ShadowsPageClient({ products, userId }: Props) {
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id ?? '')
  const [cards, setCards] = useState<CardRow[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedProduct) return
    let cancelled = false
    setLoading(true)
    fetch(`/api/profil/ombres/${selectedProduct}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Erreur')
        return res.json() as Promise<{ cards: CardRow[] }>
      })
      .then((data) => {
        if (!cancelled) setCards(data.cards)
      })
      .catch(() => {
        if (!cancelled) setCards([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [selectedProduct])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {products.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedProduct(p.id)}
            className={`filter-tag ${selectedProduct === p.id ? 'active' : ''}`}
          >
            {p.name}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="aspect-[5/7] rounded-clay bg-panel animate-pulse" />
          ))}
        </div>
      ) : (
        <ShadowWall cards={cards} userId={userId} isLoggedIn />
      )}
    </div>
  )
}
