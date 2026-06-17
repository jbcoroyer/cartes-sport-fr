'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Star, Minus, Plus } from 'lucide-react'
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
  { status: 'owned'   as const, label: 'Possédée', Icon: Check, activeClass: 'status-owned'   },
  { status: 'missing' as const, label: 'Manquante', Icon: X, activeClass: 'status-missing' },
  { status: 'wanted'  as const, label: 'Souhaitée', Icon: Star, activeClass: 'status-wanted'  },
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
      <div className="text-center">
        <p className="text-sm text-muted mb-3">
          Connecte-toi pour gérer ta collection
        </p>
        <button
          onClick={() => router.push('/login')}
          className="btn-gold px-8 py-2.5 rounded-xl text-sm"
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
      <div className="grid grid-cols-3 gap-2">
        {BUTTONS.map(({ status: s, label, Icon, activeClass }) => (
          <button
            key={s}
            onClick={() => handleToggle(s)}
            disabled={isPending}
            className={`flex flex-col items-center gap-1.5 py-3 rounded-xl2 border transition-all duration-200
              ${status === s
                ? `${activeClass} font-medium shadow-sm`
                : 'bg-surface border-border text-muted hover:border-ink/15 hover:text-ink'
              }
              ${isPending ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
            `}
          >
            <Icon size={18} strokeWidth={status === s ? 2.5 : 2} />
            <span className="text-2xs font-medium">{label}</span>
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-missing text-center">{error}</p>
      )}

      {status === 'owned' && (
        <div className="flex items-center justify-between bg-owned/5 border border-owned/20 rounded-xl2 px-4 py-3">
          <span className="text-sm text-muted">Exemplaires</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuantity(-1)}
              disabled={quantity <= 1 || isPending}
              className="w-8 h-8 rounded-full bg-panel border border-border/80 flex items-center justify-center
                         text-muted hover:text-ink disabled:opacity-30 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="text-lg font-bold w-6 text-center">{quantity}</span>
            <button
              onClick={() => handleQuantity(1)}
              disabled={isPending}
              className="w-8 h-8 rounded-full bg-panel border border-border/80 flex items-center justify-center
                         text-muted hover:text-ink transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
