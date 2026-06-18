'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import AcquisitionToggle from '@/components/cards/AcquisitionToggle'
import type { CollectionStatus } from '@/lib/types/database'

interface Props {
  cardId: string
  cardNumber: string
  playerName: string
  position?: string | null
  isOwned: boolean
  collectionStatus: CollectionStatus
  userId?: string
  isLoggedIn: boolean
  href?: string
  compact?: boolean
  onAcquired?: () => void
}

export default function BinderSlot({
  cardId,
  cardNumber,
  playerName,
  position,
  isOwned,
  collectionStatus,
  userId,
  isLoggedIn,
  href,
  compact = false,
  onAcquired,
}: Props) {
  const ariaLabel = isOwned
    ? `Carte ${cardNumber}, ${playerName}, possédée`
    : `Emplacement vide — Carte manquante numéro ${cardNumber}, ${playerName}`

  const inner = (
    <motion.div
      layout
      className={`relative aspect-[5/7] rounded-clay p-2 md:p-3 flex flex-col justify-between transition-colors duration-500 ${
        isOwned ? 'binder-slot-owned' : 'binder-slot-missing'
      } ${compact ? 'text-[10px]' : 'text-xs'}`}
      initial={false}
      animate={{ opacity: 1 }}
      aria-label={ariaLabel}
    >
      <span
        className={`font-data text-right ${isOwned ? 'text-muted' : 'text-ghost text-2xl font-light'}`}
      >
        {cardNumber}
      </span>
      <div>
        <p className={`font-medium leading-tight ${isOwned ? 'text-ink' : 'text-ghost'}`}>
          {playerName}
        </p>
        {position && (
          <p className={`mt-0.5 font-sans ${isOwned ? 'text-muted' : 'text-ghost/80'}`}>
            {position}
          </p>
        )}
      </div>
      {isLoggedIn && userId && !compact && (
        <div className="absolute top-2 left-2" onClick={(e) => e.preventDefault()}>
          <AcquisitionToggle
            cardId={cardId}
            userId={userId}
            initialStatus={collectionStatus}
            isLoggedIn={isLoggedIn}
            compact
            onAcquired={onAcquired}
          />
        </div>
      )}
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href} className="block group">
        {inner}
      </Link>
    )
  }

  return inner
}
