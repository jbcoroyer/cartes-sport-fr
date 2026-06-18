'use client'

import { useState, type ReactNode } from 'react'
import ViewToolbar from '@/components/collection/ViewToolbar'
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
      <ViewToolbar
        segments={[
          { id: 'clubs', label: 'Vestiaires' },
          { id: 'full', label: 'Album complet' },
        ]}
        activeId={mode}
        onChange={(id) => setMode(id as 'clubs' | 'full')}
      />
      <div key={mode}>
        {mode === 'clubs' ? clubsView : (
          <AlbumFullViewLoader key="full-view" setId={setId} active />
        )}
      </div>
    </div>
  )
}
