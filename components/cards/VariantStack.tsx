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
          className={`px-3 py-1.5 rounded-clay text-xs font-medium transition-all ${
            v.id === selectedId
              ? 'bg-ink text-surface shadow-soft'
              : 'bg-panel text-muted hover:text-ink border border-border'
          }`}
        >
          {getVariantLabel(v)}
        </button>
      ))}
    </div>
  )
}
