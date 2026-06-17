import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import ProductCoverStage, { isAdrenalynProduct, productDisplayName } from '@/components/products/ProductCoverStage'

export interface ProductPosterData {
  id: string
  name: string
  season: string
  total_cards: number | null
  cover_image_url: string | null
}

interface Props {
  product: ProductPosterData
}

export default function ProductPoster({ product }: Props) {
  const adrenalyn = isAdrenalynProduct(product.name)

  return (
    <Link
      href={`/catalogue?product=${product.id}`}
      className="group card-premium flex flex-col p-4 hover:-translate-y-0.5 transition-all duration-300"
    >
      <ProductCoverStage
        src={product.cover_image_url}
        alt={product.name}
        adrenalyn={adrenalyn}
        size="md"
      />

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-block text-2xs font-medium uppercase tracking-wider text-gold/70 bg-gold/10 border border-gold/15 rounded-full px-2 py-0.5">
            {product.season}
          </span>
          <h2 className="text-sm font-semibold leading-snug text-white mt-2 group-hover:text-gold transition-colors line-clamp-2">
            {productDisplayName(product.name)}
          </h2>
          {product.total_cards != null && (
            <p className="text-2xs text-white/40 mt-1">
              {product.total_cards.toLocaleString('fr-FR')} cartes
            </p>
          )}
        </div>
        <ChevronRight
          size={16}
          className="shrink-0 text-white/20 group-hover:text-gold/70 group-hover:translate-x-0.5 transition-all"
        />
      </div>
    </Link>
  )
}
