import Image from 'next/image'
import Link from 'next/link'
import ClayProgressBar from '@/components/clay/ClayProgressBar'
import { packGradient, prefersLightText, shade } from '@/lib/collection/packTheme'

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
  const c1 = shade(accent, 30)
  const c2 = shade(accent, -35)
  const background = packGradient(c1, c2)
  const lightText = prefersLightText(c2)
  const textTone = lightText ? 'text-silk-light' : 'text-silk'
  const metaTone = lightText ? 'text-silk-light-muted' : 'text-silk-muted'

  return (
    <Link
      href={`/album/${setId}/club/${teamId}`}
      className="block group"
    >
      <article className="collection-plaque shadow-pack group-hover:-translate-y-1">
        <div className="collection-plaque-surface" style={{ background }} aria-hidden="true" />

        <div className="relative z-10">
          <div className="collection-plaque-body flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center rounded-full bg-white/12 ring-1 ring-white/20 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
              {crestUrl ? (
                <Image
                  src={crestUrl}
                  alt=""
                  width={64}
                  height={64}
                  className="object-contain w-full h-full drop-shadow-clay-sm"
                />
              ) : (
                <div
                  className={`w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-lg type-subtitle ${lightText ? 'text-silk-light' : 'text-silk'}`}
                >
                  {teamName[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`type-title text-base md:text-lg truncate ${textTone}`}>
                {teamName}
              </h3>
              <p className={`text-sm font-data mt-0.5 ${metaTone}`}>
                {ownedCards}/{totalCards} — {Math.round(pctOwned)}%
              </p>
            </div>
          </div>
          <div className="collection-plaque-foot">
            <ClayProgressBar
              value={ownedCards}
              max={totalCards || 1}
              color={lightText ? 'rgba(255,255,255,0.85)' : accent}
              trackClassName="bg-black/20"
            />
          </div>
        </div>
      </article>
    </Link>
  )
}
