'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BinderSlot from './BinderSlot'
import type { CollectionStatus } from '@/lib/types/database'

export interface BinderCard {
  id: string
  cardNumber: string
  playerName: string
  position: string | null
  variantType?: string | null
  cardType?: string | null
  photoUrl?: string | null
  collectionStatus: CollectionStatus
}

interface Props {
  cards: BinderCard[]
  slotsPerPage?: number
  userId?: string
  isLoggedIn: boolean
  setId: string
  clubId: string
  onAcquired?: () => void
}

export default function BinderView({
  cards,
  slotsPerPage = 9,
  userId,
  isLoggedIn,
  setId,
  clubId,
  onAcquired,
}: Props) {
  const [page, setPage] = useState(0)
  const totalPages = Math.max(1, Math.ceil(cards.length / slotsPerPage))
  const pageCards = [...cards.slice(page * slotsPerPage, (page + 1) * slotsPerPage)]

  while (pageCards.length < slotsPerPage) {
    pageCards.push({
      id: `empty-${pageCards.length}`,
      cardNumber: '—',
      playerName: '',
      position: null,
      collectionStatus: null,
    })
  }

  return (
    <div className="collection-binder space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="p-2 rounded-clay border border-border disabled:opacity-30"
          aria-label="Page précédente"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="type-body text-sm text-muted font-data">
          Page {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="p-2 rounded-clay border border-border disabled:opacity-30"
          aria-label="Page suivante"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="binder-grid collection-binder-grid max-w-md mx-auto"
        >
          {pageCards.map((card) => (
            <div key={card.id} className="binder-slot-cell">
              {card.id.startsWith('empty-') ? (
                <div className="binder-slot binder-slot-empty" aria-hidden="true" />
              ) : (
                <BinderSlot
                  cardId={card.id}
                  cardNumber={card.cardNumber}
                  playerName={card.playerName}
                  position={card.position}
                  variantType={card.variantType}
                  cardType={card.cardType}
                  photoUrl={card.photoUrl}
                  isOwned={card.collectionStatus === 'owned'}
                  collectionStatus={card.collectionStatus}
                  userId={userId}
                  isLoggedIn={isLoggedIn}
                  href={`/carte/${card.id}?from=/album/${setId}/club/${clubId}`}
                  onAcquired={onAcquired}
                />
              )}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
