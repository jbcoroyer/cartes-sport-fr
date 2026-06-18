'use client'

import { useEffect, useState } from 'react'
import FullAlbumGrid, { type AlbumGridCard } from '@/components/album/FullAlbumGrid'

interface Props {
  setId: string
  userId?: string
  isLoggedIn: boolean
  active: boolean
}

export default function AlbumFullViewLoader({ setId, userId, isLoggedIn, active }: Props) {
  const [cards, setCards] = useState<AlbumGridCard[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!active || cards) return

    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/albums/${setId}/cards`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Impossible de charger l\'album complet')
        return res.json() as Promise<{ cards: AlbumGridCard[] }>
      })
      .then((data) => {
        if (!cancelled) setCards(data.cards)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [active, cards, setId])

  if (!active) return null

  if (loading) {
    return (
      <p className="text-center text-muted text-sm py-16 font-sans">
        Chargement de l&apos;album complet…
      </p>
    )
  }

  if (error) {
    return (
      <p className="text-center text-accent-wine text-sm py-16 font-sans">
        {error}
      </p>
    )
  }

  if (!cards) return null

  return (
    <FullAlbumGrid
      cards={cards}
      setId={setId}
      userId={userId}
      isLoggedIn={isLoggedIn}
    />
  )
}
