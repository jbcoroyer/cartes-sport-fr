import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAuthUser } from '@/lib/supabase/auth'
import { getCatalogProduct, getCatalogProductName } from '@/lib/catalog'
import BackButton from '@/components/ui/BackButton'
import AlbumHeader from '@/components/album/AlbumHeader'
import ClubPlaque from '@/components/album/ClubPlaque'
import AlbumViewToggle from '@/components/album/AlbumViewToggle'
import {
  emptyProgress,
  getSetProgressForProduct,
  getClubProgressForSet,
} from '@/lib/collection'

interface Props {
  params: Promise<{ setId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { setId } = await params
  const name = await getCatalogProductName(setId)
  return { title: name ?? 'Album' }
}

export default async function AlbumPage({ params }: Props) {
  const { setId } = await params
  const { supabase, user } = await getAuthUser()

  const product = await getCatalogProduct(setId)
  if (!product) notFound()

  const [progressData, clubs] = await Promise.all([
    user ? getSetProgressForProduct(supabase, user.id, setId) : Promise.resolve(null),
    getClubProgressForSet(supabase, user?.id ?? null, setId),
  ])

  const progress = progressData ?? emptyProgress(
    product.id,
    product.name,
    product.season,
    product.total_base ?? 0,
    product.total_master ?? 0,
  )

  const publisher = (product.series_types as { publishers?: { name: string } | null } | null)
    ?.publishers?.name

  return (
    <main className="min-h-screen bg-museum">
      <div className="page-container py-8 md:py-12">
        <BackButton href="/" label="Bibliothèque" />

        <AlbumHeader
          name={product.name}
          season={product.season}
          publisherName={publisher}
          releaseDate={product.release_date}
          progress={progress}
        />

        <AlbumViewToggle
          setId={setId}
          userId={user?.id}
          isLoggedIn={!!user}
          clubsView={
            <div key="clubs-view" className="club-grid">
              {clubs.map((club) => (
                <ClubPlaque
                  key={club.teamId}
                  setId={setId}
                  teamId={club.teamId}
                  teamName={club.teamName}
                  crestUrl={club.crestUrl}
                  colorPrimary={club.colorPrimary}
                  ownedCards={club.ownedCards}
                  totalCards={club.totalCards}
                  pctOwned={club.pctOwned}
                />
              ))}
            </div>
          }
        />
      </div>
    </main>
  )
}
