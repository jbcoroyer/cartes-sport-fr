import type { Metadata } from 'next'
import { getAuthUser } from '@/lib/supabase/auth'
import { getCatalogProducts } from '@/lib/catalog'
import Reveal from '@/components/motion/Reveal'
import CardItem from '@/components/library/CardItem'
import {
  emptyProgress,
  getUserSetProgress,
} from '@/lib/collection'

export const metadata: Metadata = {
  title: 'Bibliothèque',
  description: 'Vos albums de collection — progression Base et Master Set',
}

export default async function LibraryPage() {
  const { supabase, user } = await getAuthUser()

  const [products, progresses] = await Promise.all([
    getCatalogProducts(),
    user ? getUserSetProgress(supabase, user.id) : Promise.resolve([]),
  ])

  const progressMap = new Map(progresses.map((p) => [p.productId, p]))

  return (
    <main className="min-h-screen bg-museum">
      <section className="page-container pt-12 md:pt-20 pb-8">
        <Reveal>
          <h1 className="type-hero text-display-sm md:text-display max-w-3xl">
            Bibliothèque
          </h1>
          <p className="type-body text-base text-muted mt-4 max-w-xl leading-relaxed">
            Vos albums de collection — remplissez, admirez, progressez.
          </p>
        </Reveal>
      </section>

      <section className="page-container pb-16 md:pb-24">
        <Reveal delay={0.05}>
          <h2 className="section-title">Collections</h2>
        </Reveal>

        <div className="library-grid">
          {products.map((product) => {
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
              <CardItem
                key={product.id}
                productId={product.id}
                name={product.name}
                season={product.season}
                publisherName={publisher}
                progress={progress}
              />
            )
          })}
        </div>

        {products.length === 0 && (
          <p className="text-center text-muted text-sm py-16 type-body">
            Aucun album disponible pour le moment.
          </p>
        )}
      </section>
    </main>
  )
}
