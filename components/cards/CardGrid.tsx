import CardItem from './CardItem'
import type { CardWithDetails } from '@/lib/types/database'

interface Props {
  cards: CardWithDetails[]
}

export default function CardGrid({ cards }: Props) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-4xl mb-3">🔍</span>
        <p className="text-white/50 text-sm">Aucune carte trouvée</p>
        <p className="text-white/30 text-xs mt-1">Essaie un autre filtre ou nom de joueur</p>
      </div>
    )
  }

  return (
    <div className="card-grid">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  )
}
