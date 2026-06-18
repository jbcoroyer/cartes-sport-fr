'use client'

import { useState, type ReactNode } from 'react'
import AlbumFullViewLoader from '@/components/album/AlbumFullViewLoader'

interface Props {
  setId: string
  userId?: string
  isLoggedIn: boolean
  clubsView: ReactNode
}

export default function AlbumViewToggle({ setId, userId, isLoggedIn, clubsView }: Props) {
  const [mode, setMode] = useState<'clubs' | 'full'>('clubs')

  return (
    <div>
      <div className="flex justify-end mb-6">
        <div className="segment-control w-auto">
          <button
            className={`segment-item px-4 ${mode === 'clubs' ? 'active' : ''}`}
            onClick={() => setMode('clubs')}
          >
            Vestiaires
          </button>
          <button
            className={`segment-item px-4 ${mode === 'full' ? 'active' : ''}`}
            onClick={() => setMode('full')}
          >
            Album complet
          </button>
        </div>
      </div>
      <div key={mode}>
        {mode === 'clubs' ? clubsView : (
          <AlbumFullViewLoader
            key="full-view"
            setId={setId}
            userId={userId}
            isLoggedIn={isLoggedIn}
            active
          />
        )}
      </div>
    </div>
  )
}
