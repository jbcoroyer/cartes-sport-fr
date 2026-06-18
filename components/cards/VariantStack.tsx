'use client'

import type { CardLike } from '@/lib/collection/variants'
import { getVariantLabel } from '@/lib/collection/variants'

interface Props {
  variants: CardLike[]
  selectedId: string
  onSelect: (id: string) => void
}

export default function VariantStack({ variants, selectedId, onSelect }: Props) {
  if (variants.length <= 1) return null

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Variants de la carte">
      {variants.map((v) => (
        <button
          key={v.id}
          role="tab"
          aria-selected={v.id === selectedId}
          onClick={() => onSelect(v.id)}
          className={`px-3 py-1.5 rounded-clay text-xs transition-all ${
            v.id === selectedId
              ? 'type-subtitle bg-ink text-surface shadow-soft'
              : 'type-body bg-panel text-muted hover:text-ink border border-border'
          }`}
        >
          {getVariantLabel(v)}
        </button>
      ))}
    </div>
  )
}
