'use client'

import AnimatedCounter from '@/components/ui/AnimatedCounter'

interface Props {
  totalOwned: number
  totalMissing: number
  totalValue: number
  seriesCount: number
}

export default function CollectionStats({ totalOwned, totalMissing, totalValue, seriesCount }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="stat-tile col-span-2 sm:col-span-1">
        <p className="text-2xl font-bold text-gold">
          {totalValue >= 1000 ? (
            <AnimatedCounter value={totalValue / 1000} decimals={1} suffix="k €" />
          ) : (
            <AnimatedCounter value={totalValue} decimals={0} suffix=" €" />
          )}
        </p>
        <p className="text-2xs text-white/40 mt-1 uppercase tracking-wider">Valeur estimée</p>
      </div>
      <div className="stat-tile">
        <p className="text-2xl font-bold text-owned">
          <AnimatedCounter value={totalOwned} />
        </p>
        <p className="text-2xs text-white/40 mt-1 uppercase tracking-wider">Possédées</p>
      </div>
      <div className="stat-tile">
        <p className="text-2xl font-bold text-missing">
          <AnimatedCounter value={totalMissing} />
        </p>
        <p className="text-2xs text-white/40 mt-1 uppercase tracking-wider">Manquantes</p>
      </div>
      <div className="stat-tile">
        <p className="text-2xl font-bold text-white/80">
          <AnimatedCounter value={seriesCount} />
        </p>
        <p className="text-2xs text-white/40 mt-1 uppercase tracking-wider">Séries</p>
      </div>
    </div>
  )
}
