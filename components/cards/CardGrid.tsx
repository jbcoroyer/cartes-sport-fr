import CardItem from './CardItem'
import { SearchX } from 'lucide-react'
import type { CardWithDetails } from '@/lib/types/database'

interface Props {
  cards: CardWithDetails[]
}

export default function CardGrid({ cards }: Props) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-panel/60 border border-border/60 flex items-center justify-center mb-4">
          <SearchX size={24} className="text-muted/70" />
        </div>
        <p className="text-muted text-sm font-medium">Aucune carte trouvée</p>
        <p className="text-muted/80 text-xs mt-1">Essaie un autre filtre ou nom de joueur</p>
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
