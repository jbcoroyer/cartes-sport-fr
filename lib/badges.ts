import type { SetProgress } from '@/lib/collection/progress'

export interface Badge {
  id: string
  label: string
  description: string
  earned: boolean
}

export function computeBadges(
  progresses: SetProgress[],
  clubHundredPct: boolean,
  acquisitionsLast7Days: number,
): Badge[] {
  const completedSets = progresses.filter((p) => p.pctBase >= 100)

  return [
    {
      id: 'set-complete',
      label: 'Le Set est à toi',
      description: 'Base Set complété à 100%',
      earned: completedSets.length > 0,
    },
    {
      id: 'club-ultimate',
      label: 'Supporter Ultime',
      description: '100% d\'un club dans un set',
      earned: clubHundredPct,
    },
    {
      id: 'active-collector',
      label: 'Collectionneur Actif',
      description: '10 ajouts en une semaine',
      earned: acquisitionsLast7Days >= 10,
    },
  ]
}
