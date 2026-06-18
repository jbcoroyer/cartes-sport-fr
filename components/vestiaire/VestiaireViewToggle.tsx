'use client'

import { useState, type ReactNode } from 'react'
import ViewToolbar from '@/components/collection/ViewToolbar'

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
      <ViewToolbar
        segments={[
          { id: 'binder', label: 'Classeur' },
          { id: 'list', label: 'Liste' },
        ]}
        activeId={mode}
        onChange={(id) => setMode(id as 'binder' | 'list')}
        trailing={
          mode === 'list' ? (
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nom ou numéro…"
              className="search-input"
            />
          ) : undefined
        }
      />
      {mode === 'binder' ? (
        binderView
      ) : (
        <ul className="collection-list space-y-2">
          {filtered.map((c) => (
            <li key={c.id}>{c.node}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
