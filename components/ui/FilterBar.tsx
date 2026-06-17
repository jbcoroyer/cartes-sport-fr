'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition as useReactTransition } from 'react'

interface Product {
  id: string
  name: string
  season: string
}

interface Props {
  products: Product[]
  activeProduct?: string
}

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

  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    const series = p.name.includes('Adrenalyn') ? 'Adrenalyn XL'
      : p.name.includes('Score') ? 'Score'
      : p.name.includes('Topps Chrome') ? 'Topps Chrome'
      : 'Autres'
    if (!acc[series]) acc[series] = []
    acc[series].push(p)
    return acc
  }, {})

  function shortLabel(name: string) {
    return name
      .replace('Adrenalyn XL Ligue 1 ', 'AXL ')
      .replace('Topps Chrome UEFA Club Competitions ', 'TC ')
  }

  return (
    <div className="scroll-x mt-3 -mx-5 px-5">
      <button
        onClick={() => setProduct(null)}
        className={`filter-tag ${!activeProduct ? 'active' : ''}`}
      >
        Tout
      </button>

      {Object.entries(grouped).map(([, prods]) =>
        prods.map((p) => (
          <button
            key={p.id}
            onClick={() => setProduct(activeProduct === p.id ? null : p.id)}
            className={`filter-tag ${activeProduct === p.id ? 'active' : ''}`}
          >
            {shortLabel(p.name)}
          </button>
        ))
      )}
    </div>
  )
}
