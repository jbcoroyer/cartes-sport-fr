'use client'

import Link from 'next/link'
import AcquisitionToggle from '@/components/cards/AcquisitionToggle'
import { getBinderSlotLabels } from '@/lib/collection/variants'
import type { CollectionStatus } from '@/lib/types/database'

interface Props {
  cardId: string
  cardNumber: string
  playerName: string
  position?: string | null
  variantType?: string | null
  cardType?: string | null
  photoUrl?: string | null
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
  variantType,
  cardType,
  photoUrl,
  isOwned,
  collectionStatus,
  userId,
  isLoggedIn,
  href,
  compact = false,
  onAcquired,
}: Props) {
  const { slotNumber, variant } = getBinderSlotLabels(cardNumber, variantType, cardType)
  const ariaLabel = isOwned
    ? `Carte ${cardNumber}, ${playerName}, possédée`
    : `Emplacement vide — Carte manquante numéro ${cardNumber}, ${playerName}`

  const tone = isOwned
    ? {
        number: 'text-muted',
        variant: 'text-muted',
        name: 'text-ink',
        position: 'text-muted',
      }
    : {
        number: 'text-ink/55',
        variant: 'text-ink/50',
        name: 'text-ink',
        position: 'text-muted',
      }

  const inner = (
    <div
      className={`binder-slot ${isOwned ? 'binder-slot-owned' : 'binder-slot-missing'} ${
        compact ? 'text-[10px]' : ''
      } group-hover:shadow-clay-sm`}
      aria-label={ariaLabel}
    >
      <div className="binder-slot-inner">
        <div className="binder-slot-header">
          {isLoggedIn && userId && !compact ? (
            <div className="shrink-0" onClick={(e) => e.preventDefault()}>
              <AcquisitionToggle
                cardId={cardId}
                userId={userId}
                initialStatus={collectionStatus}
                isLoggedIn={isLoggedIn}
                compact
                onAcquired={onAcquired}
              />
            </div>
          ) : (
            <span className="w-8 shrink-0" aria-hidden="true" />
          )}
          <span className={`binder-slot-number ${tone.number}`}>{slotNumber}</span>
        </div>

        <div className="binder-slot-mid">
          {isOwned && photoUrl ? (
            <img src={photoUrl} alt="" className="binder-slot-photo" loading="lazy" decoding="async" />
          ) : (
            variant && (
              <span className={`binder-slot-variant ${tone.variant}`}>{variant}</span>
            )
          )}
        </div>

        <div className="binder-slot-foot">
          <p className={`binder-slot-name ${tone.name}`}>{playerName}</p>
          {position && (
            <p className={`binder-slot-pos ${tone.position}`}>{position}</p>
          )}
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block w-full group">
        {inner}
      </Link>
    )
  }

  return inner
}
