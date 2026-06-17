'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'next/navigation'

interface Product {
  id: string
  name: string
  season: string
}

interface Props {
  products: Product[]
  activeProduct?: string
}

// Next.js note: useTransition from 'react', not 'next/navigation'
import { useTransition as useReactTransition } from 'react'

export default function FilterBar({ products, activeProduct }: Props) {
  const router     = useRouter()
  const pathname   = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useReactTransition()

  const setProduct = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id) {
      params.set('product', id)
    } else {
      params.delete('product')
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  // Regroupe les produits par série pour l'affichage
  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    const series = p.name.includes('Adrenalyn') ? 'Adrenalyn XL'
      : p.name.includes('Score') ? 'Score'
      : p.name.includes('Topps Chrome') ? 'Topps Chrome'
      : 'Autres'
    if (!acc[series]) acc[series] = []
    acc[series].push(p)
    return acc
  }, {})

  return (
    <div className="scroll-x mt-2 -mx-4 px-4">
      {/* Tout */}
      <button
        onClick={() => setProduct(null)}
        className={`filter-tag ${!activeProduct ? 'active' : ''}`}
      >
        Tout
      </button>

      {/* Par série */}
      {Object.entries(grouped).map(([series, prods]) =>
        prods.map((p) => (
          <button
            key={p.id}
            onClick={() => setProduct(activeProduct === p.id ? null : p.id)}
            className={`filter-tag ${activeProduct === p.id ? 'active' : ''}`}
          >
            {/* Label court */}
            {p.name.replace('Adrenalyn XL Ligue 1 ', 'AXL ')
                    .replace('Topps Chrome UEFA Club Competitions ', 'TC ')}
          </button>
        ))
      )}
    </div>
  )
}
