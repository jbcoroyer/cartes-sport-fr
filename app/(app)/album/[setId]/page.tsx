import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
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
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('name').eq('id', setId).single()
  return { title: data?.name ?? 'Album' }
}

export default async function AlbumPage({ params }: Props) {
  const { setId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: product } = await supabase
    .from('products')
    .select(`
      id, name, season, release_date, total_base, total_master, binder_slots_per_page,
      series_types ( name, publishers ( name ) )
    `)
    .eq('id', setId)
    .single()

  if (!product) notFound()

  const progressData = user
    ? await getSetProgressForProduct(supabase, user.id, setId)
    : null

  const progress = progressData ?? emptyProgress(
    product.id,
    product.name,
    product.season,
    product.total_base ?? 0,
    product.total_master ?? 0,
  )

  const clubs = await getClubProgressForSet(supabase, user?.id ?? null, setId)

  const publisher = (product.series_types as { publishers?: { name: string } | null } | null)
    ?.publishers?.name

  return (
    <main className="min-h-screen bg-museum">
      <div className="page-container py-8 md:py-12">
        <BackButton href="/" label="Bibliothèque" />

        <AlbumHeader
          name={product.name}
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
