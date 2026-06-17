'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { CollectionStatus } from '@/lib/types/database'

interface Props {
  cardId: string
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
  cardId, initialStatus, initialQuantity, isLoggedIn,
}: Props) {
  const router = useRouter()
  const [status,   setStatus]   = useState<CollectionStatus>(initialStatus)
  const [quantity, setQuantity] = useState(initialQuantity)
  const [isPending, startTransition] = useTransition()

  const supabase = createClient()

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

    // Si on clique sur le statut actif → on supprime
    const targetStatus = newStatus === status ? null : newStatus

    startTransition(async () => {
      setStatus(targetStatus)

      if (!targetStatus) {
        // Supprime l'entrée
        await supabase
          .from('user_collections')
          .delete()
          .eq('card_id', cardId)
        return
      }

      // Upsert
      await supabase
        .from('user_collections')
        .upsert({
          card_id: cardId,
          status: targetStatus,
          quantity: targetStatus === 'owned' ? quantity : 1,
        }, { onConflict: 'user_id,card_id' })

      router.refresh()
    })
  }

  const handleQuantity = (delta: number) => {
    const next = Math.max(1, quantity + delta)
    setQuantity(next)
    startTransition(async () => {
      await supabase
        .from('user_collections')
        .upsert({
          card_id: cardId,
          status: 'owned',
          quantity: next,
        }, { onConflict: 'user_id,card_id' })
    })
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-white/40 uppercase tracking-wider">Ma collection</p>

      {/* Boutons statut */}
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

      {/* Compteur de doublons (affiché uniquement si possédée) */}
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
