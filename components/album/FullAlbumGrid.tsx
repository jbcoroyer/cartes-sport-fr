'use client'

import Link from 'next/link'
import BinderSlot from '@/components/vestiaire/BinderSlot'
import type { CollectionStatus } from '@/lib/types/database'

export interface AlbumGridCard {
  id: string
  cardNumber: string
  playerName: string
  position: string | null
  teamName: string
  collectionStatus: CollectionStatus
}

interface Props {
  cards: AlbumGridCard[]
  setId: string
  userId?: string
  isLoggedIn: boolean
}

export default function FullAlbumGrid({ cards, setId, userId, isLoggedIn }: Props) {
  const byTeam = new Map<string, AlbumGridCard[]>()
  for (const card of cards) {
    const list = byTeam.get(card.teamName) ?? []
    list.push(card)
    byTeam.set(card.teamName, list)
  }

  return (
    <div className="space-y-10">
      {Array.from(byTeam.entries()).map(([teamName, teamCards]) => (
        <section key={teamName}>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-serif text-sm text-muted">{teamName}</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {teamCards.map((card) => (
              <Link key={card.id} href={`/carte/${card.id}?from=/album/${setId}`}>
                <BinderSlot
                  cardId={card.id}
                  cardNumber={card.cardNumber}
                  playerName={card.playerName}
                  position={card.position}
                  isOwned={card.collectionStatus === 'owned'}
                  collectionStatus={card.collectionStatus}
                  userId={userId}
                  isLoggedIn={isLoggedIn}
                  compact
                />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
