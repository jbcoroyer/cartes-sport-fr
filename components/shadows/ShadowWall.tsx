'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BinderSlot from '@/components/vestiaire/BinderSlot'
import AcquisitionToggle from '@/components/cards/AcquisitionToggle'
import type { CollectionStatus } from '@/lib/types/database'

export interface ShadowCard {
  id: string
  cardNumber: string
  playerName: string
  position: string | null
  variantType?: string | null
  cardType?: string | null
  collectionStatus: CollectionStatus
}

interface Props {
  cards: ShadowCard[]
  userId: string
  isLoggedIn: boolean
}

export default function ShadowWall({ cards, userId, isLoggedIn }: Props) {
  const [revealingId, setRevealingId] = useState<string | null>(null)
  const missing = cards.filter((c) => c.collectionStatus !== 'owned')

  if (missing.length === 0) {
    return (
      <p className="text-center text-muted py-12 type-body">
        Aucune carte manquante — set complet !
      </p>
    )
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
      <AnimatePresence>
        {missing.map((card) => (
          <motion.div
            key={card.id}
            layout
            initial={{ opacity: 0.6 }}
            animate={{
              opacity: revealingId === card.id ? 1 : 0.85,
              scale: revealingId === card.id ? 1.05 : 1,
            }}
            exit={{ opacity: 0, scale: 1.1, filter: 'brightness(1.5)' }}
            transition={{ duration: 0.5 }}
            className="binder-slot-cell space-y-2"
          >
            <BinderSlot
              cardId={card.id}
              cardNumber={card.cardNumber}
              playerName={card.playerName}
              position={card.position}
              variantType={card.variantType}
              cardType={card.cardType}
              isOwned={false}
              collectionStatus={card.collectionStatus}
              userId={userId}
              isLoggedIn={isLoggedIn}
              compact
            />
            {isLoggedIn && (
              <AcquisitionToggle
                cardId={card.id}
                userId={userId}
                initialStatus={card.collectionStatus}
                isLoggedIn={isLoggedIn}
                compact
                onAcquired={() => {
                  setRevealingId(card.id)
                  setTimeout(() => setRevealingId(null), 800)
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
