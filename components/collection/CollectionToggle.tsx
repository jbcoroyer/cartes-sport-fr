'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { CollectionStatus } from '@/lib/types/database'

interface Props {
  cardId: string
  userId: string
  initialStatus: CollectionStatus
  initialQuantity: number
  isLoggedIn: boolean
}

const BUTTONS = [
  { status: 'owned'   as const, label: 'Possédée', icon: '✓', activeClass: 'status-owned'   },
  { status: 'missing' as const, label: 'Manquante', icon: '✕', activeClass: 'status-missing' },
  { status: 'wanted'  as const, label: 'Souhaitée', icon: '★', activeClass: 'status-wanted'  },
]

export default function CollectionToggle({
  cardId, userId, initialStatus, initialQuantity, isLoggedIn,
}: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<CollectionStatus>(initialStatus)
  const [quantity, setQuantity] = useState(initialQuantity)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (!isLoggedIn) {
    return (
      <div className="bg-surface border border-border rounded-card p-4 text-center">
        <p className="text-sm text-white/50 mb-3">
          Connecte-toi pour gérer ta collection
        </p>
        <button
          onClick={() => router.push('/login')}
          className="btn-gold px-6 py-2 rounded-lg text-sm"
        >
          Se connecter
        </button>
      </div>
    )
  }

  const handleToggle = (newStatus: CollectionStatus) => {
    if (isPending) return
    setError(null)

    const targetStatus = newStatus === status ? null : newStatus

    startTransition(async () => {
      const supabase = createClient()

      if (!targetStatus) {
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
        router.refresh()
        return
      }

      const { error: upsertErr } = await supabase
        .from('user_collections')
        .upsert({
          user_id: userId,
          card_id: cardId,
          status: targetStatus,
          quantity: targetStatus === 'owned' ? quantity : 1,
        }, { onConflict: 'user_id,card_id' })

      if (upsertErr) {
        setError(upsertErr.message)
        return
      }

      setStatus(targetStatus)
      router.refresh()
    })
  }

  const handleQuantity = (delta: number) => {
    const next = Math.max(1, quantity + delta)
    setQuantity(next)
    setError(null)

    startTransition(async () => {
      const supabase = createClient()
      const { error: upsertErr } = await supabase
        .from('user_collections')
        .upsert({
          user_id: userId,
          card_id: cardId,
          status: 'owned',
          quantity: next,
        }, { onConflict: 'user_id,card_id' })

      if (upsertErr) setError(upsertErr.message)
      else router.refresh()
    })
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-white/40 uppercase tracking-wider">Ma collection</p>

      <div className="grid grid-cols-3 gap-2">
        {BUTTONS.map(({ status: s, label, icon, activeClass }) => (
          <button
            key={s}
            onClick={() => handleToggle(s)}
            disabled={isPending}
            className={`flex flex-col items-center gap-1 py-3 rounded-card border transition-all duration-150
              ${status === s
                ? `${activeClass} font-medium`
                : 'bg-surface border-border text-white/40 hover:border-white/20'
              }
              ${isPending ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
            `}
          >
            <span className="text-lg">{icon}</span>
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-missing">⚠ {error}</p>
      )}

      {status === 'owned' && (
        <div className="flex items-center justify-between bg-surface border border-owned/30 rounded-card px-4 py-3">
          <span className="text-sm text-white/60">Exemplaires</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuantity(-1)}
              disabled={quantity <= 1 || isPending}
              className="w-8 h-8 rounded-full bg-panel border border-border flex items-center justify-center
                         text-white/60 hover:text-white disabled:opacity-30 transition-colors"
            >
              −
            </button>
            <span className="text-lg font-semibold w-6 text-center">{quantity}</span>
            <button
              onClick={() => handleQuantity(1)}
              disabled={isPending}
              className="w-8 h-8 rounded-full bg-panel border border-border flex items-center justify-center
                         text-white/60 hover:text-white transition-colors"
            >
              +
            </button>
          </div>
          {quantity > 1 && (
            <span className="text-xs text-white/30">{quantity - 1} doublon{quantity > 2 ? 's' : ''}</span>
          )}
        </div>
      )}
    </div>
  )
}
