interface EventWithCard {
  id: string
  acquired_at: string
  source: string | null
  notes: string | null
  cards?: { card_number: string; player_name: string; variant_type: string } | null
}

interface Props {
  events: EventWithCard[]
}

export default function AcquisitionTimeline({ events }: Props) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted font-sans">Aucune acquisition enregistrée pour le moment.</p>
    )
  }

  return (
    <ol className="relative border-l border-border ml-3 space-y-6">
      {events.map((event) => {
        const date = new Date(event.acquired_at).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
        })
        const card = event.cards
        const label = card
          ? `${card.player_name} ${card.variant_type !== 'base' ? card.variant_type : ''}`.trim()
          : 'Carte'

        return (
          <li key={event.id} className="ml-6 relative">
            <span className="absolute -left-[1.65rem] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-forest border-2 border-museum" />
            <time className="text-xs text-muted font-sans">{date}</time>
            <p className="font-serif text-sm mt-0.5">
              Acquis : <span className="text-ink">{label}</span>
            </p>
            {event.source && (
              <p className="text-xs text-muted mt-0.5 font-sans">Source : {event.source}</p>
            )}
            {event.notes && (
              <p className="text-xs text-muted mt-0.5 font-sans italic">Note : {event.notes}</p>
            )}
          </li>
        )
      })}
    </ol>
  )
}
