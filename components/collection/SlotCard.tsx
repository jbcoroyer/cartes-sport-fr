import Link from 'next/link'
import { HelpCircle } from 'lucide-react'
import type { CollectionStatus } from '@/lib/types/database'

interface Props {
  cardId: string
  cardNumber: string | null
  playerName: string
  status: CollectionStatus | null
}

export default function SlotCard({ cardId, cardNumber, playerName, status }: Props) {
  const isWanted = status === 'wanted'

  return (
    <Link href={`/catalogue/${cardId}`} className="block group">
      <div className={`slot-empty transition-all duration-200 group-hover:border-gold/30 group-active:scale-95 ${
        isWanted ? 'border-wanted/40 bg-wanted/5' : ''
      }`}>
        <span className="text-2xs font-mono text-white/20">#{cardNumber ?? '—'}</span>
        <HelpCircle size={20} className="text-white/10 group-hover:text-white/20 transition-colors" />
        <p className="text-[9px] text-white/25 text-center px-1 truncate w-full leading-tight">
          {playerName}
        </p>
        {isWanted && (
          <span className="absolute top-1.5 right-1.5 text-[8px] text-wanted font-medium uppercase">
            ★
          </span>
        )}
        {status === 'missing' && (
          <span className="absolute bottom-1.5 left-1.5 text-[8px] text-missing/60 font-medium">
            manquante
          </span>
        )}
      </div>
    </Link>
  )
}
