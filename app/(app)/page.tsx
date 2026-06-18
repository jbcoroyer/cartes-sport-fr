import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Reveal from '@/components/motion/Reveal'
import AlbumCoverTile from '@/components/library/AlbumCoverTile'
import {
  emptyProgress,
  getUserSetProgress,
  getRecentlyUpdatedProductIds,
} from '@/lib/collection'
import { getPublisherAccent } from '@/lib/publisherColors'

export const metadata: Metadata = {
  title: 'Bibliothèque',
  description: 'Vos albums de collection — progression Base et Master Set',
}

export default async function LibraryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: products } = await supabase
    .from('products')
    .select(`
      id, name, season, total_base, total_master, is_active,
      series_types (
        name,
        publishers ( name )
      )
    `)
    .order('season', { ascending: false })
    .order('name', { ascending: true })

  const progresses = user ? await getUserSetProgress(supabase, user.id) : []
  const progressMap = new Map(progresses.map((p) => [p.productId, p]))
  const recentIds = getRecentlyUpdatedProductIds(progresses)

  return (
    <main className="min-h-screen bg-museum">
      <section className="page-container pt-12 md:pt-20 pb-8">
        <Reveal>
          <h1 className="font-serif text-display-sm md:text-display font-medium max-w-3xl">
            Bibliothèque
          </h1>
          <p className="text-base text-muted mt-4 max-w-xl leading-relaxed font-sans">
            Vos albums de collection — remplissez, admirez, progressez.
          </p>
        </Reveal>
      </section>

      <section className="page-container pb-16 md:pb-24">
        <Reveal delay={0.05}>
          <h2 className="section-title">Collections</h2>
        </Reveal>

        <div className="library-grid">
          {(products ?? []).map((product, i) => {
            const publisher = (product.series_types as { publishers?: { name: string } | null } | null)
              ?.publishers?.name
            const progress = progressMap.get(product.id) ?? emptyProgress(
              product.id,
              product.name,
              product.season,
              product.total_base ?? 0,
              product.total_master ?? 0,
            )

            return (
              <Reveal key={product.id} delay={0.08 + i * 0.04}>
                <AlbumCoverTile
                  productId={product.id}
                  name={product.name}
                  season={product.season}
                  publisherName={publisher}
                  accentColor={getPublisherAccent(publisher)}
                  progress={progress}
                  recentlyUpdated={recentIds.has(product.id)}
                />
              </Reveal>
            )
          })}
        </div>

        {(products?.length ?? 0) === 0 && (
          <p className="text-center text-muted text-sm py-16 font-sans">
            Aucun album disponible pour le moment.
          </p>
        )}
      </section>
    </main>
  )
}
