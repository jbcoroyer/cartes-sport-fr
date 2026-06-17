'use client'

import Link from 'next/link'

interface SeriesItem {
  product_id: string | null
  product_name: string | null
  completion_pct: number | null
}

interface Props {
  series: SeriesItem[]
  activeProductId: string
}

function shortName(name: string) {
  return name
    .replace('Adrenalyn XL Ligue 1 ', 'AXL ')
    .replace('Topps Chrome UEFA Club Competitions ', 'TC ')
    .replace('Panini ', '')
}

export default function SeriesPills({ series, activeProductId }: Props) {
  return (
    <div className="scroll-x -mx-5 md:-mx-8 lg:-mx-12 px-5 md:px-8 lg:px-12">
      {series.map((s) => {
        if (!s.product_id) return null
        const isActive = s.product_id === activeProductId
        return (
          <Link
            key={s.product_id}
            href={`/collection/${s.product_id}`}
            className={`filter-tag flex items-center gap-2 ${isActive ? 'active' : ''}`}
          >
            <span className="truncate max-w-[140px]">
              {shortName(s.product_name ?? 'Série')}
            </span>
            <span className={`text-2xs ${isActive ? 'text-gold' : 'text-white/30'}`}>
              {Math.round(s.completion_pct ?? 0)}%
            </span>
          </Link>
        )
      })}
    </div>
  )
}
