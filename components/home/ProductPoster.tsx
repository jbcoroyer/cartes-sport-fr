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
      className="group block bg-surface border border-border rounded-2xl p-4 hover:border-ink/15 hover:shadow-card transition-all duration-300"
    >
      <ProductCoverStage
        src={product.cover_image_url}
        alt={product.name}
        adrenalyn={adrenalyn}
        size="md"
      />

      <div className="mt-4">
        <p className="text-2xs text-muted uppercase tracking-wider">{product.season}</p>
        <h2 className="text-sm font-medium leading-snug text-ink mt-1.5 line-clamp-2">
          {productDisplayName(product.name)}
        </h2>
        {product.total_cards != null && (
          <p className="text-2xs text-muted mt-1">
            {product.total_cards.toLocaleString('fr-FR')} cartes
          </p>
        )}
      </div>
    </Link>
  )
}
