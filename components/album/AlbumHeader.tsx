'use client'

import ClayProgressBar from '@/components/clay/ClayProgressBar'
import type { SetProgress } from '@/lib/collection/progress'

interface Props {
  name: string
  publisherName?: string | null
  releaseDate?: string | null
  progress: SetProgress
  layoutId?: string
}

export default function AlbumHeader({
  name,
  publisherName,
  releaseDate,
  progress,
}: Props) {
  const formattedDate = releaseDate
    ? new Date(releaseDate).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <header className="mb-10 md:mb-14">
      <p className="section-title">{publisherName ?? 'Collection'}</p>
      <h1 className="font-serif text-display-sm md:text-display font-medium max-w-3xl">
        {name}
      </h1>
      {formattedDate && (
        <p className="text-muted mt-2 font-sans">Parution — {formattedDate}</p>
      )}
      <div className="mt-8 grid sm:grid-cols-2 gap-6 max-w-xl">
        <ClayProgressBar
          label={`Base Set — ${progress.baseOwned}/${progress.baseTotal}`}
          value={progress.baseOwned}
          max={progress.baseTotal || 1}
          color="#2D5A4A"
        />
        <ClayProgressBar
          label={`Master Set — ${progress.masterOwned}/${progress.masterTotal}`}
          value={progress.masterOwned}
          max={progress.masterTotal || 1}
          color="#6B2D3E"
        />
      </div>
    </header>
  )
}
