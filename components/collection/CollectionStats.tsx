interface Props {
  totalOwned: number
  totalMissing: number
  totalValue: number
}

export default function CollectionStats({ totalOwned, totalMissing, totalValue }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-surface border border-border rounded-card p-3 text-center">
        <p className="text-xl font-semibold text-owned">{totalOwned}</p>
        <p className="text-[11px] text-white/40 mt-0.5">Possédées</p>
      </div>
      <div className="bg-surface border border-border rounded-card p-3 text-center">
        <p className="text-xl font-semibold text-missing">{totalMissing}</p>
        <p className="text-[11px] text-white/40 mt-0.5">Manquantes</p>
      </div>
      <div className="bg-surface border border-border rounded-card p-3 text-center">
        <p className="text-xl font-semibold text-gold">
          {totalValue >= 1000
            ? `${(totalValue / 1000).toFixed(1)}k`
            : totalValue.toFixed(0)
          } €
        </p>
        <p className="text-[11px] text-white/40 mt-0.5">Valeur estimée</p>
      </div>
    </div>
  )
}
