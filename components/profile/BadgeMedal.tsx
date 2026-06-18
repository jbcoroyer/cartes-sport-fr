interface Badge {
  id: string
  label: string
  description: string
  earned: boolean
}

interface Props {
  badges: Badge[]
}

export default function BadgeMedal({ badges }: Props) {
  const earned = badges.filter((b) => b.earned)

  if (earned.length === 0) {
    return <p className="text-sm text-muted font-sans">Aucune distinction pour le moment.</p>
  }

  return (
    <div className="flex flex-wrap gap-4">
      {earned.map((badge) => (
        <div
          key={badge.id}
          className="flex flex-col items-center gap-2 w-24 text-center"
          title={badge.description}
        >
          <div className="w-14 h-14 rounded-full bg-panel border border-border shadow-clay-sm flex items-center justify-center">
            <span className="text-lg">🏅</span>
          </div>
          <span className="text-[10px] font-medium text-muted leading-tight font-sans">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export type { Badge }
