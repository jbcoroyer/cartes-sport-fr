import type { CollectionStatus } from '@/lib/types/database'

export interface AlbumGridCard {
  id: string
  cardNumber: string
  playerName: string
  position: string | null
  teamName: string
  teamId: string
  variantType?: string | null
  cardType?: string | null
  photoUrl?: string | null
  collectionStatus: CollectionStatus
}
