import Link from 'next/link'
import Image from 'next/image'
import { Layers, Sparkles } from 'lucide-react'

export interface ProductPosterData {
  id: string
  name: string
  season: string
  total_cards: number | null
  cover_image_url: string | null
}

function isAdrenalyn(name: string) {
  return name.includes('Adrenalyn')
}

function displayName(name: string) {
  return name
    .replace('Adrenalyn XL Ligue 1 ', 'Adrenalyn XL ')
    .replace('Topps Chrome UEFA Club Competitions ', 'Topps Chrome ')
}

interface Props {
  product: ProductPosterData
}

export default function ProductPoster({ product }: Props) {
  const adrenalyn = isAdrenalyn(product.name)
  const hasCover = !!product.cover_image_url

  return (
    <Link
      href={`/catalogue?product=${product.id}`}
      className="group block rounded-xl3 overflow-hidden border border-border/60
                 transition-all duration-300 hover:scale-[1.02] hover:border-gold/30
                 hover:shadow-card-hover shadow-premium"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {hasCover ? (
          <Image
            src={product.cover_image_url!}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 ${
              adrenalyn
                ? 'bg-gradient-to-br from-gold-dark/40 via-gold/20 to-canvas'
                : 'bg-gradient-to-br from-cyan-900/40 via-panel to-canvas'
            }`}
          >
            {adrenalyn ? (
              <Layers size={48} className="text-gold/50" strokeWidth={1.25} />
            ) : (
              <Sparkles size={48} className="text-cyan-400/50" strokeWidth={1.25} />
            )}
            <p className="text-lg font-bold text-center text-white/70 leading-tight">
              {displayName(product.name)}
            </p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-canvas/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <span className="inline-block text-2xs font-medium uppercase tracking-wider text-gold/80 bg-gold/10 border border-gold/20 rounded-full px-2.5 py-0.5 mb-2">
            {product.season}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight text-white">
            {displayName(product.name)}
          </h2>
          {product.total_cards != null && (
            <p className="text-sm text-white/50 mt-1.5">
              {product.total_cards.toLocaleString('fr-FR')} cartes
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
