'use client'

import Image from 'next/image'
import PremiumCard from './PremiumCard'
import RarityBadge from './RarityBadge'
import BackButton from '@/components/ui/BackButton'

interface Props {
  imageUrl: string | null
  playerName: string
  rarityName?: string | null
  rarityColorHex?: string | null
}

export default function CardShowcase({ imageUrl, playerName, rarityName, rarityColorHex }: Props) {
  return (
    <div className="relative bg-surface overflow-hidden">
      <div className="absolute inset-0 bg-hero-radial pointer-events-none" />

      <div className="relative flex items-center justify-center py-8 px-6 min-h-[320px]">
        <PremiumCard
          rarityName={rarityName}
          rarityColorHex={rarityColorHex}
          enableTilt
          glowIntensity="high"
          className="w-full max-w-[240px]"
        >
          <div className="relative aspect-[3/4] bg-panel/60">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={playerName}
                fill
                className="object-contain p-4"
                priority
                sizes="240px"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/20">
                <span className="text-5xl">🃏</span>
                <span className="text-sm">Image non disponible</span>
              </div>
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
