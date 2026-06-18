import Link from 'next/link'
import { getBinderSlotLabels } from '@/lib/collection/variants'

interface Props {
  cardId: string
  cardNumber: string
  playerName: string
  position?: string | null
  variantType?: string | null
  cardType?: string | null
  photoUrl?: string | null
  isOwned: boolean
  setId: string
}

/** Slot statique pour la grille album complet — pas d'hydratation client. */
export default function AlbumGridSlot({
  cardNumber,
  playerName,
  position,
  variantType,
  cardType,
  photoUrl,
  isOwned,
  cardId,
  setId,
}: Props) {
  const { slotNumber, variant } = getBinderSlotLabels(cardNumber, variantType, cardType)
  const tone = isOwned
    ? { number: 'text-muted', variant: 'text-muted', name: 'text-ink', position: 'text-muted' }
    : { number: 'text-ink/55', variant: 'text-ink/50', name: 'text-ink', position: 'text-muted' }

  return (
    <Link
      href={`/carte/${cardId}?from=/album/${setId}`}
      className="block w-full group"
    >
      <div
        className={`binder-slot text-[10px] group-hover:shadow-clay-sm ${
          isOwned ? 'binder-slot-owned' : 'binder-slot-missing'
        }`}
      >
        <div className="binder-slot-inner">
          <div className="binder-slot-header">
            <span className="w-8 shrink-0" aria-hidden="true" />
            <span className={`binder-slot-number ${tone.number}`}>{slotNumber}</span>
          </div>
          <div className="binder-slot-mid">
            {isOwned && photoUrl ? (
              <img
                src={photoUrl}
                alt=""
                className="binder-slot-photo"
                loading="lazy"
                decoding="async"
              />
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
    </Link>
  )
}
