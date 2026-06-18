interface Props {
  value: number
  max?: number
  color?: string
  className?: string
  label?: string
}

export default function ClayProgressBar({
  value,
  max = 100,
  color = '#2D5A4A',
  className = '',
  label,
}: Props) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between text-xs text-muted mb-1.5 font-sans">
          <span>{label}</span>
          <span className="font-data">{pct}%</span>
        </div>
      )}
      <div className="h-1 rounded-full bg-panel overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
