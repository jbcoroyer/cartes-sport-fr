import Link from 'next/link'
import Image from 'next/image'
import { ScanLine, LayoutGrid } from 'lucide-react'

interface Props {
  displayName: string
  avatarUrl?: string | null
}

export default function CollectionEmpty({ displayName, avatarUrl }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="relative mb-8">
        <div className="w-24 h-32 rounded-card bg-panel/60 border border-dashed border-gold/30 flex items-center justify-center">
          <span className="text-4xl opacity-30">🃏</span>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
          <span className="text-gold text-sm">+</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Ta collection t&apos;attend</h3>
      <p className="text-sm text-muted mb-8 max-w-xs">
        Salut {displayName} ! Scanne ta première carte ou parcours le catalogue pour commencer.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link href="/scan" className="btn-gold flex items-center justify-center gap-2 py-3">
          <ScanLine size={18} />
          Scanner une carte
        </Link>
        <Link href="/catalogue" className="btn-ghost flex items-center justify-center gap-2 py-3">
          <LayoutGrid size={18} />
          Explorer
        </Link>
      </div>
    </div>
  )
}
