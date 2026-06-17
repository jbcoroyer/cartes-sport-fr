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
      {/* Hero compact */}
      <section className="relative bg-hero-radial border-b border-border/40">
        <div className="page-container py-10 md:py-14">
          <Reveal>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Cartes Sport <span className="text-gradient-gold">FR</span>
            </h1>
            <p className="text-sm md:text-base text-white/50 mt-3 max-w-2xl leading-relaxed">
              Catalogue, collection et cote de marché des cartes Panini Adrenalyn XL et Topps Chrome UEFA
            </p>
          </Reveal>
        </div>
      </section>

      {/* Grille des collections */}
      <section className="page-container py-10 md:py-14">
        <Reveal delay={0.05}>
          <h2 className="section-title mb-6">Choisis ta collection</h2>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {(products ?? []).map((product, i) => (
            <Reveal key={product.id} delay={0.08 + i * 0.05}>
              <ProductPoster product={product} />
            </Reveal>
          ))}
        </div>

        {(products?.length ?? 0) === 0 && (
          <p className="text-center text-white/40 text-sm py-16">
            Aucune collection disponible pour le moment.
          </p>
        )}
      </section>
    </main>
  )
}
