'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import AlbumGridSlot from '@/components/album/AlbumGridSlot'
import type { AlbumGridCard } from '@/components/album/FullAlbumGrid'

interface TeamSummary {
  teamId: string
  teamName: string
  cardCount: number
}

interface Props {
  setId: string
}

export default function FullAlbumAccordion({ setId }: Props) {
  const [teams, setTeams] = useState<TeamSummary[] | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [cardsByTeam, setCardsByTeam] = useState<Map<string, AlbumGridCard[]>>(new Map())
  const [loadingTeam, setLoadingTeam] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/albums/${setId}/cards?summary=1`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Impossible de charger l\'album')
        return res.json() as Promise<{ teams: TeamSummary[] }>
      })
      .then((data) => {
        if (cancelled) return
        setTeams(data.teams)
        if (data.teams[0]) {
          setExpanded(new Set([data.teams[0].teamId]))
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
    return () => { cancelled = true }
  }, [setId])

  const loadTeam = useCallback(async (teamId: string) => {
    if (cardsByTeam.has(teamId) || loadingTeam) return
    setLoadingTeam(teamId)
    try {
      const res = await fetch(`/api/albums/${setId}/cards?teamId=${teamId}`)
      if (!res.ok) throw new Error('Erreur de chargement')
      const data = await res.json() as { cards: AlbumGridCard[] }
      setCardsByTeam((prev) => new Map(prev).set(teamId, data.cards))
    } catch {
      setError('Impossible de charger ce club')
    } finally {
      setLoadingTeam(null)
    }
  }, [cardsByTeam, loadingTeam, setId])

  useEffect(() => {
    for (const teamId of expanded) {
      void loadTeam(teamId)
    }
  }, [expanded, loadTeam])

  const toggleTeam = (teamId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(teamId)) next.delete(teamId)
      else next.add(teamId)
      return next
    })
  }

  if (error) {
    return <p className="text-center text-accent-wine text-sm py-16 type-body">{error}</p>
  }

  if (!teams) {
    return <AlbumFullSkeleton />
  }

  return (
    <div className="space-y-3">
      {teams.map((team) => {
        const isOpen = expanded.has(team.teamId)
        const cards = cardsByTeam.get(team.teamId)
        const isLoading = loadingTeam === team.teamId

        return (
          <section key={team.teamId} className="rounded-clay border border-border bg-surface overflow-hidden">
            <button
              type="button"
              onClick={() => toggleTeam(team.teamId)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-panel/60 transition-colors"
              aria-expanded={isOpen}
            >
              <ChevronDown
                size={18}
                className={`shrink-0 text-muted transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}
              />
              <span className="type-title text-sm flex-1 truncate">{team.teamName}</span>
              <span className="text-xs font-data text-muted shrink-0">{team.cardCount} cartes</span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 border-t border-border/60">
                {isLoading && !cards && <TeamGridSkeleton />}
                {cards && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 pt-4">
                    {cards.map((card) => (
                      <AlbumGridSlot
                        key={card.id}
                        cardId={card.id}
                        cardNumber={card.cardNumber}
                        playerName={card.playerName}
                        position={card.position}
                        variantType={card.variantType}
                        cardType={card.cardType}
                        photoUrl={card.photoUrl}
                        isOwned={card.collectionStatus === 'owned'}
                        setId={setId}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

function AlbumFullSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-14 rounded-clay bg-panel animate-pulse" />
      ))}
    </div>
  )
}

function TeamGridSkeleton() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 pt-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="aspect-[5/7] rounded-clay bg-panel animate-pulse" />
      ))}
    </div>
  )
}
