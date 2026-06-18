'use client'

import FullAlbumAccordion from '@/components/album/FullAlbumAccordion'

interface Props {
  setId: string
  active: boolean
}

export default function AlbumFullViewLoader({ setId, active }: Props) {
  if (!active) return null
  return <FullAlbumAccordion setId={setId} />
}
