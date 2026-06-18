'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import VariantStack from './VariantStack'
import AcquisitionToggle from './AcquisitionToggle'
import type { CardLike } from '@/lib/collection/variants'
import type { CollectionStatus } from '@/lib/types/database'

interface Props {
  variants: CardLike[]
  initialCardId: string
  userId?: string
  isLoggedIn: boolean
  initialStatus: CollectionStatus
}

export default function CardDetailClient({
  variants,
  initialCardId,
  userId,
  isLoggedIn,
  initialStatus,
}: Props) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState(initialCardId)

  const handleSelect = (id: string) => {
    setSelectedId(id)
    router.replace(`/carte/${id}`, { scroll: false })
  }

  return (
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
          initialStatus={initialStatus}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  )
}
