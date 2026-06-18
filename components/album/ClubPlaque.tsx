'use client'

import Link from 'next/link'
import Image from 'next/image'
import ClayProgressBar from '@/components/clay/ClayProgressBar'

interface Props {
  setId: string
  teamId: string
  teamName: string
  crestUrl: string | null
  colorPrimary: string | null
  ownedCards: number
  totalCards: number
  pctOwned: number
}

export default function ClubPlaque({
  setId,
  teamId,
  teamName,
  crestUrl,
  colorPrimary,
  ownedCards,
  totalCards,
  pctOwned,
}: Props) {
  const accent = colorPrimary ?? '#4A6278'

  return (
    <Link href={`/album/${setId}/club/${teamId}`} className="block group">
      <article
        className="clay-card overflow-hidden transition-transform duration-300 group-hover:-translate-y-0.5"
        style={{
          background: `linear-gradient(160deg, ${accent}14 0%, transparent 55%), white`,
        }}
      >
        <div className="p-5 md:p-6 flex items-center gap-4">
          <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center">
            {crestUrl ? (
              <Image
                src={crestUrl}
                alt=""
                width={64}
                height={64}
                className="object-contain drop-shadow-clay-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-panel flex items-center justify-center text-lg font-serif text-muted">
                {teamName[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-base md:text-lg font-medium truncate">{teamName}</h3>
            <p className="text-sm text-muted font-data mt-0.5">
              {ownedCards}/{totalCards} — {Math.round(pctOwned)}%
            </p>
          </div>
        </div>
        <div className="px-5 md:px-6 pb-5">
          <ClayProgressBar value={ownedCards} max={totalCards} color={accent} />
        </div>
      </article>
    </Link>
  )
}
