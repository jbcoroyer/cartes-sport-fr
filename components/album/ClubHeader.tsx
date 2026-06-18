import EntityHeader from '@/components/collection/EntityHeader'
import ClayProgressBar from '@/components/clay/ClayProgressBar'
import { packGradient, prefersLightText, shade } from '@/lib/collection/packTheme'

interface Props {
  teamName: string
  productName: string
  crestUrl: string | null
  accentColor: string
  ownedCards: number
  totalCards: number
}

export default function ClubHeader({
  teamName,
  productName,
  crestUrl,
  accentColor,
  ownedCards,
  totalCards,
}: Props) {
  const pct = totalCards > 0 ? Math.round((ownedCards / totalCards) * 100) : 0
  const c1 = shade(accentColor, 30)
  const c2 = shade(accentColor, -35)
  const background = packGradient(c1, c2)
  const lightText = prefersLightText(c2)
  const metaTone = lightText ? 'text-silk-light-muted' : 'text-silk-muted'

  return (
    <EntityHeader
      eyebrow={productName}
      title={teamName}
      subtitle="Vestiaire"
      crestUrl={crestUrl}
      crestFallback={teamName[0]}
      surfaceBackground={background}
      forceLightText={lightText}
      titleVariant="title"
    >
      <div className="max-w-xl">
        <p className={`type-body mb-3 font-data ${metaTone}`}>
          {ownedCards}/{totalCards} cartes — {pct}%
        </p>
        <ClayProgressBar
          value={ownedCards}
          max={totalCards || 1}
          color={lightText ? 'rgba(255,255,255,0.85)' : accentColor}
          trackClassName="bg-black/20"
        />
      </div>
    </EntityHeader>
  )
}
