import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ProductPoster from '@/components/home/ProductPoster'
import Reveal from '@/components/motion/Reveal'

export const metadata: Metadata = {
  title: 'Accueil',
  description: 'Catalogue, collection et cote de marché des cartes Panini Adrenalyn XL et Topps Chrome UEFA',
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, season, total_cards, cover_image_url')
    .order('season', { ascending: false })

  return (
    <main className="min-h-screen">
      <section className="page-container pt-16 md:pt-24 pb-12 md:pb-16">
        <Reveal>
          <h1 className="text-display-sm md:text-display font-semibold tracking-tight max-w-3xl">
            Catalogue & collection
          </h1>
          <p className="text-base md:text-lg text-muted mt-4 max-w-xl leading-relaxed">
            Panini Adrenalyn XL et Topps Chrome UEFA — cotes et suivi de collection.
          </p>
        </Reveal>
      </section>

      <section className="page-container pb-16 md:pb-24">
        <Reveal delay={0.05}>
          <h2 className="section-title">Collections</h2>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {(products ?? []).map((product, i) => (
            <Reveal key={product.id} delay={0.08 + i * 0.05}>
              <ProductPoster product={product} />
            </Reveal>
          ))}
        </div>

        {(products?.length ?? 0) === 0 && (
          <p className="text-center text-muted text-sm py-16">
            Aucune collection disponible pour le moment.
          </p>
        )}
      </section>
    </main>
  )
}
