'use client'

import type { ReactNode } from 'react'

interface Segment {
  id: string
  label: string
}

interface Props {
  segments: Segment[]
  activeId: string
  onChange: (id: string) => void
  trailing?: ReactNode
}

export default function ViewToolbar({ segments, activeId, onChange, trailing }: Props) {
  return (
    <div className="collection-toolbar">
      <div className="segment-control w-auto shrink-0">
        {segments.map((seg) => (
          <button
            key={seg.id}
            type="button"
            className={`segment-item px-4 ${activeId === seg.id ? 'active' : ''}`}
            onClick={() => onChange(seg.id)}
          >
            {seg.label}
          </button>
        ))}
      </div>
      {trailing && <div className="w-full sm:w-auto sm:ml-auto">{trailing}</div>}
    </div>
  )
}
