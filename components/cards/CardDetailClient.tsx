'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CardSlot from '@/components/cards/CardSlot'
import CardPhotoCapture from '@/components/cards/CardPhotoCapture'
import VariantStack from './VariantStack'
import AcquisitionToggle from './AcquisitionToggle'
import type { CardLike } from '@/lib/collection/variants'
import type { CollectionStatus } from '@/lib/types/database'

export interface VariantCollection {
  status: CollectionStatus
  photoUrl: string | null
}

interface Props {
  variants: CardLike[]
  initialCardId: string
  teamName?: string | null
  collectionsByCardId: Record<string, VariantCollection>
  userId?: string
  isLoggedIn: boolean
}

export default function CardDetailClient({
  variants,
  initialCardId,
  teamName,
  collectionsByCardId,
  userId,
  isLoggedIn,
}: Props) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState(initialCardId)

  useEffect(() => {
    setSelectedId(initialCardId)
  }, [initialCardId])

  const selected = variants.find((v) => v.id === selectedId) ?? variants[0]
  const collection = collectionsByCardId[selectedId]
  const [displayPhoto, setDisplayPhoto] = useState(collection?.photoUrl ?? null)

  useEffect(() => {
    setDisplayPhoto(collection?.photoUrl ?? null)
  }, [selectedId, collection?.photoUrl])

  const handleSelect = (id: string) => {
    setSelectedId(id)
    router.replace(`/carte/${id}`, { scroll: false })
  }

  if (!selected) return null

  const isOwned = collection?.status === 'owned'

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <CardSlot size="lg" photoUrl={displayPhoto}>
        <span className="font-data text-sm text-muted">#{selected.card_number}</span>
        <div>
          <h1 className="type-title text-xl leading-tight">{selected.player_name}</h1>
          {teamName && <p className="type-body text-sm text-muted mt-1">{teamName}</p>}
          {selected.position && (
            <p className="type-caption text-xs text-muted">{selected.position}</p>
          )}
        </div>
      </CardSlot>

      {isLoggedIn && userId && (
        <CardPhotoCapture
          key={selectedId}
          cardId={selectedId}
          userId={userId}
          initialPhotoUrl={collection?.photoUrl ?? null}
          canCapture={isOwned}
          onPhotoChange={setDisplayPhoto}
        />
      )}

      {isLoggedIn && !isOwned && (
        <p className="text-xs text-muted text-center type-body -mt-4">
          Ajoutez la carte à votre collection pour la photographier.
        </p>
      )}

      <div className="w-full space-y-6">
        <VariantStack
          variants={variants}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
        {userId && (
          <AcquisitionToggle
            cardId={selectedId}
            userId={userId}
            initialStatus={collection?.status ?? null}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>
    </div>
  )
}
