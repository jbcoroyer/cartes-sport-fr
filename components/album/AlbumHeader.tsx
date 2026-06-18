import EntityHeader from '@/components/collection/EntityHeader'
import ClayProgressBar from '@/components/clay/ClayProgressBar'
import { getPackTheme } from '@/lib/collection/packTheme'
import type { SetProgress } from '@/lib/collection/progress'

interface Props {
  name: string
  season: string
  publisherName?: string | null
  releaseDate?: string | null
  progress: SetProgress
}

export default function AlbumHeader({
  name,
  season,
  publisherName,
  releaseDate,
  progress,
}: Props) {
  const theme = getPackTheme(name, season, publisherName)
  const formattedDate = releaseDate
    ? new Date(releaseDate).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <EntityHeader
      eyebrow={publisherName ?? 'Collection'}
      title={name}
      subtitle={formattedDate ? `Parution — ${formattedDate}` : undefined}
      titleVariant="hero"
      packTheme={theme}
    >
      <div className="grid sm:grid-cols-2 gap-6 max-w-xl">
        <ClayProgressBar
          label={`Base Set — ${progress.baseOwned}/${progress.baseTotal}`}
          value={progress.baseOwned}
          max={progress.baseTotal || 1}
          color={theme.silkLight ? 'rgba(255,255,255,0.85)' : '#2D5A4A'}
          labelClassName={theme.silkLight ? 'text-silk-light-muted' : undefined}
          trackClassName={theme.silkLight ? 'bg-black/20' : 'bg-panel'}
        />
        <ClayProgressBar
          label={`Master Set — ${progress.masterOwned}/${progress.masterTotal}`}
          value={progress.masterOwned}
          max={progress.masterTotal || 1}
          color={theme.silkLight ? 'rgba(255,255,255,0.55)' : '#6B2D3E'}
          labelClassName={theme.silkLight ? 'text-silk-light-muted' : undefined}
          trackClassName={theme.silkLight ? 'bg-black/20' : 'bg-panel'}
        />
      </div>
    </EntityHeader>
  )
}
