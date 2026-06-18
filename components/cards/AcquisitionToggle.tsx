'use client'

import { useState, useTransition } from 'react'
import { Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { CollectionStatus } from '@/lib/types/database'

interface Props {
  cardId: string
  userId: string
  initialStatus: CollectionStatus
  isLoggedIn: boolean
  compact?: boolean
  onAcquired?: () => void
}

export default function AcquisitionToggle({
  cardId,
  userId,
  initialStatus,
  isLoggedIn,
  compact = false,
  onAcquired,
}: Props) {
  const [status, setStatus] = useState<CollectionStatus>(initialStatus)
  const [flash, setFlash] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (!isLoggedIn) {
    return (
      <p className="text-sm text-muted text-center type-body">
        Connecte-toi pour ajouter cette carte à ta collection.
      </p>
    )
  }

  const toggleOwned = () => {
    if (isPending) return
    setError(null)
    const becomingOwned = status !== 'owned'

    startTransition(async () => {
      const supabase = createClient()

      if (status === 'owned') {
        const { error: delErr } = await supabase
          .from('user_collections')
          .delete()
          .eq('user_id', userId)
          .eq('card_id', cardId)

        if (delErr) {
          setError(delErr.message)
          return
        }
        setStatus(null)
        return
      }

      const { error: upsertErr } = await supabase
        .from('user_collections')
        .upsert(
          {
            user_id: userId,
            card_id: cardId,
            status: 'owned',
            quantity: 1,
            acquired_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,card_id' },
        )

      if (upsertErr) {
        setError(upsertErr.message)
        return
      }

      setStatus('owned')
      if (becomingOwned) {
        setFlash(true)
        setTimeout(() => setFlash(false), 1200)
        onAcquired?.()
      }
    })
  }

  return (
    <div className="relative">
      <button
        onClick={toggleOwned}
        disabled={isPending}
        className={`relative flex items-center justify-center type-body transition-all duration-300 ${
          compact
            ? 'w-8 h-8 rounded-full border'
            : 'w-full px-6 py-3 rounded-clay-md'
        } ${
          status === 'owned'
            ? compact
              ? 'bg-accent-forest/12 text-accent-forest border-accent-forest/35'
              : 'bg-accent-forest/10 text-accent-forest border border-accent-forest/30'
            : compact
              ? 'bg-surface/95 text-muted border-border'
              : 'bg-ink text-surface hover:bg-ink/90'
        } ${isPending ? 'opacity-50' : 'active:scale-[0.98]'} ${
          flash ? 'ring-2 ring-accent-forest ring-offset-1' : ''
        }`}
        aria-pressed={status === 'owned'}
        aria-label={status === 'owned' ? 'Retirer de la collection' : 'Ajouter à la collection'}
      >
        <Check size={compact ? 16 : 18} strokeWidth={2.5} />
        {!compact && <span>{status === 'owned' ? 'Dans ma collection' : 'Ajouter à ma collection'}</span>}
      </button>

      {error && <p className="text-xs text-accent-wine mt-2 text-center">{error}</p>}
    </div>
  )
}
