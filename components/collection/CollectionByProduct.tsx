import Link from 'next/link'
import Image from 'next/image'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CollectionByProduct({ items }: { items: any[] }) {
  // Groupe par produit
  const byProduct = items.reduce<Record<string, { name: string; cards: typeof items }>>((acc, uc) => {
    const product = uc.cards?.products
    if (!product) return acc
    const key = product.id
    if (!acc[key]) acc[key] = { name: product.name, cards: [] }
    acc[key].cards.push(uc)
    return acc
  }, {})

  return (
    <section>
      <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
        Dernières cartes ajoutées
      </h2>
      <div className="space-y-5">
        {Object.entries(byProduct).map(([productId, { name, cards }]) => (
          <div key={productId}>
            <p className="text-xs text-white/40 mb-2 truncate">{name}</p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scroll-x">
              {cards.slice(0, 12).map((uc) => {
                const card = uc.cards
                return (
                  <Link
                    key={uc.id}
                    href={`/catalogue/${card.id}`}
                    className="flex-none w-20 bg-surface border border-border rounded-lg overflow-hidden
                               hover:border-gold/30 transition-colors active:scale-95"
                  >
                    <div className="relative aspect-[3/4] bg-panel">
                      {card.image_url ? (
                        <Image
                          src={card.image_url}
                          alt={card.player_name}
                          fill
                          sizes="80px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xl text-white/10">
                          🃏
                        </div>
                      )}
                      {uc.quantity > 1 && (
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-gold rounded-full
                                        flex items-center justify-center text-[9px] text-canvas font-bold">
                          {uc.quantity}
                        </div>
                      )}
                    </div>
                    <p className="text-[9px] text-white/50 p-1 truncate">{card.player_name}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
