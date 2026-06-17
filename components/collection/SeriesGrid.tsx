'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import CircularProgress from '@/components/ui/CircularProgress'
import ProductCoverStage, { isAdrenalynProduct, productDisplayName } from '@/components/products/ProductCoverStage'
import Reveal from '@/components/motion/Reveal'

interface SeriesItem {
  product_id: string | null
  product_name: string | null
  cover_image_url?: string | null
  owned_count: number | null
  missing_count: number | null
  total_cards: number | null
  completion_pct: number | null
}

interface Props {
  series: SeriesItem[]
}

export default function SeriesGrid({ series }: Props) {
  if (series.length === 0) return null

  return (
    <div className="series-grid">
      {series.map((s, i) => {
        const name = s.product_name ?? ''
        const adrenalyn = isAdrenalynProduct(name)

        return (
          <Reveal key={s.product_id} delay={i * 0.05}>
            <Link
              href={`/collection/${s.product_id}`}
              className="group glass-panel rounded-xl2 p-3.5 flex gap-3.5 transition-all duration-300 hover:border-gold/25 hover:shadow-glow-sm"
            >
              <ProductCoverStage
                src={s.cover_image_url ?? null}
                alt={name}
                adrenalyn={adrenalyn}
                size="sm"
                className="w-[72px] shrink-0"
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-gold transition-colors">
                      {productDisplayName(name)}
                    </p>
                    <p className="text-2xs text-white/40 mt-1">
                      {s.owned_count ?? 0} / {s.total_cards ?? 0} cartes
                    </p>
                  </div>
                  <CircularProgress value={s.completion_pct ?? 0} size={44} strokeWidth={3} />
                </div>

                <div className="h-1 bg-panel rounded-full overflow-hidden mt-2.5">
                  <div
                    className="h-full bg-gold-gradient rounded-full transition-all duration-700"
                    style={{ width: `${s.completion_pct ?? 0}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-2">
                  {(s.missing_count ?? 0) > 0 ? (
                    <span className="text-2xs text-missing/80">
                      {s.missing_count} manquante{(s.missing_count ?? 0) > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-2xs text-owned/80">Complète !</span>
                  )}
                  <ChevronRight size={14} className="text-white/25 group-hover:text-gold transition-colors" />
                </div>
              </div>
            </Link>
          </Reveal>
        )
      })}
    </div>
  )
}
