'use client'

import Link from 'next/link'
import CardSlot from '@/components/cards/CardSlot'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

interface ShowcaseCard {
  cardId: string
  gridPosition: number
  cardNumber: string
  playerName: string
  photoUrl?: string | null
}

interface Props {
  userId: string
  cards: ShowcaseCard[]
  ownedCards: { id: string; cardNumber: string; playerName: string; photoUrl?: string | null }[]
}

export default function ExhibitionWall({ userId, cards, ownedCards }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const slots = Array.from({ length: 9 }, (_, i) => {
    const existing = cards.find((c) => c.gridPosition === i)
    return existing ?? null
  })

  const addToSlot = (position: number, cardId: string) => {
    startTransition(async () => {
      const supabase = createClient()
      const { error: err } = await supabase.from('user_showcase').upsert(
        { user_id: userId, card_id: cardId, grid_position: position },
        { onConflict: 'user_id,grid_position' },
      )
      if (err) setError(err.message)
      else router.refresh()
    })
  }

  return (
    <section>
      <h2 className="type-title text-xl mb-6">Mur d&apos;exposition</h2>
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto p-6 bg-panel/40 rounded-clay-lg">
        {slots.map((slot, i) => (
          <div key={i} className="flex justify-center">
            {slot ? (
              <Link href={`/carte/${slot.cardId}`}>
                <CardSlot size="sm" interactive photoUrl={slot.photoUrl}>
                  <span className="font-data text-muted text-[10px]">{slot.cardNumber}</span>
                  <p className="type-subtitle text-[11px] leading-tight">{slot.playerName}</p>
                </CardSlot>
              </Link>
            ) : (
              <div className="w-[100px] aspect-[5/7] rounded-clay border border-dashed border-ghost bg-surface/50 flex items-center justify-center">
                {ownedCards.length > 0 && !isPending ? (
                  <select
                    className="text-[10px] text-muted bg-transparent text-center max-w-full"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) addToSlot(i, e.target.value)
                    }}
                  >
                    <option value="">+</option>
                    {ownedCards.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.cardNumber} {c.playerName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-ghost text-xl">+</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-accent-wine mt-2">{error}</p>}
    </section>
  )
}
