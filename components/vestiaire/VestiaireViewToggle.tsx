'use client'

import { useState, type ReactNode } from 'react'

interface Props {
  binderView: ReactNode
  listCards: { id: string; cardNumber: string; playerName: string; node: ReactNode }[]
}

export default function VestiaireViewToggle({ binderView, listCards }: Props) {
  const [mode, setMode] = useState<'binder' | 'list'>('binder')
  const [query, setQuery] = useState('')

  const filtered = listCards.filter((c) => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      c.playerName.toLowerCase().includes(q) ||
      c.cardNumber.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="segment-control w-auto">
          <button
            className={`segment-item px-4 ${mode === 'binder' ? 'active' : ''}`}
            onClick={() => setMode('binder')}
          >
            Classeur
          </button>
          <button
            className={`segment-item px-4 ${mode === 'list' ? 'active' : ''}`}
            onClick={() => setMode('list')}
          >
            Liste
          </button>
        </div>
        {mode === 'list' && (
          <div className="relative w-full sm:max-w-xs">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nom ou numéro…"
              className="search-input"
            />
          </div>
        )}
      </div>
      {mode === 'binder' ? (
        binderView
      ) : (
        <ul className="space-y-2">
          {filtered.map((c) => (
            <li key={c.id}>{c.node}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
