'use client'

import Image from 'next/image'
import PremiumCard from './PremiumCard'
import RarityBadge from './RarityBadge'
import CardMonogramArt from './CardMonogramArt'
import BackButton from '@/components/ui/BackButton'
import { hasRealCardImage } from '@/lib/cardVisual'

interface Props {
  imageUrl: string | null
  playerName: string
  cardId?: string
  cardNumber?: string | null
  rarityName?: string | null
  rarityColorHex?: string | null
}

export default function CardShowcase({
  imageUrl,
  playerName,
  cardId,
  cardNumber,
  rarityName,
  rarityColorHex,
}: Props) {
  return (
    <div className="relative bg-canvas border-b border-border">
      <div className="relative flex items-center justify-center py-12 md:py-16 px-6 min-h-[340px]">
        <PremiumCard
          rarityName={rarityName}
          rarityColorHex={rarityColorHex}
          enableTilt
          glowIntensity="high"
          relief
          className="w-full max-w-[220px]"
        >
          <div className="relative aspect-[3/4] bg-panel">
            {hasRealCardImage(imageUrl, cardId) ? (
              <Image
                src={imageUrl!}
                alt={playerName}
                fill
                className="object-contain p-4"
                priority
                sizes="220px"
              />
            ) : (
              <CardMonogramArt
                playerName={playerName}
                rarityColorHex={rarityColorHex}
                cardNumber={cardNumber}
                size="lg"
                richDetails
              />
            )}

            {rarityName && (
              <div className="absolute top-3 right-3 z-10">
                <RarityBadge name={rarityName} colorHex={rarityColorHex} />
              </div>
            )}
          </div>
        </PremiumCard>
      </div>

      <BackButton />
    </div>
  )
}
