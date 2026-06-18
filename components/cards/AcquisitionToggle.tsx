'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const router = useRouter()
  const [status, setStatus] = useState<CollectionStatus>(initialStatus)
  const [showCheck, setShowCheck] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (!isLoggedIn) {
    return (
      <p className="text-sm text-muted text-center font-sans">
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
        router.refresh()
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
        setShowCheck(true)
        setTimeout(() => setShowCheck(false), 1200)
        onAcquired?.()
      }
      router.refresh()
    })
  }

  return (
    <div className="relative">
      <button
        onClick={toggleOwned}
        disabled={isPending}
        className={`relative flex items-center justify-center gap-2 font-sans font-medium transition-all duration-300 ${
          compact
            ? 'w-8 h-8 rounded-full'
            : 'w-full px-6 py-3 rounded-clay-md'
        } ${
          status === 'owned'
            ? 'bg-accent-forest/10 text-accent-forest border border-accent-forest/30'
            : 'bg-ink text-surface hover:bg-ink/90'
        } ${isPending ? 'opacity-50' : 'active:scale-[0.98]'}`}
        aria-pressed={status === 'owned'}
        aria-label={status === 'owned' ? 'Retirer de la collection' : 'Ajouter à la collection'}
      >
        <Check size={compact ? 16 : 18} strokeWidth={2.5} />
        {!compact && <span>{status === 'owned' ? 'Dans ma collection' : 'Ajouter à ma collection'}</span>}
      </button>

      <AnimatePresence>
        {showCheck && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="absolute inset-0 rounded-clay-md border-2 border-accent-forest pointer-events-none"
          />
        )}
      </AnimatePresence>

      {error && <p className="text-xs text-accent-wine mt-2 text-center">{error}</p>}
    </div>
  )
}
