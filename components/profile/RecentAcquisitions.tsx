'use client'

import Link from 'next/link'
import CardSlot from '@/components/cards/CardSlot'

interface Story {
  id: string
  cardId: string
  cardNumber: string
  playerName: string
  acquiredAt: string
}

interface Props {
  stories: Story[]
}

export default function RecentAcquisitions({ stories }: Props) {
  if (stories.length === 0) return null

  return (
    <div className="scroll-x">
      {stories.map((s) => (
        <Link
          key={s.id}
          href={`/carte/${s.cardId}`}
          className="shrink-0 w-28 flex flex-col items-center gap-2"
        >
          <CardSlot size="sm" interactive={false}>
            <span className="font-data text-[10px] text-muted">{s.cardNumber}</span>
            <p className="text-[10px] font-medium leading-tight line-clamp-2">{s.playerName}</p>
          </CardSlot>
          <time className="text-[10px] text-muted font-sans">
            {new Date(s.acquiredAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          </time>
        </Link>
      ))}
    </div>
  )
}
