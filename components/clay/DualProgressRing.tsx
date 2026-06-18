interface Props {
  basePct: number
  masterPct: number
  size?: number
  className?: string
}

export default function DualProgressRing({
  basePct,
  masterPct,
  size = 72,
  className = '',
}: Props) {
  const stroke = 3
  const rOuter = (size - stroke) / 2 - 2
  const rInner = rOuter - 6
  const cOuter = 2 * Math.PI * rOuter
  const cInner = 2 * Math.PI * rInner
  const cx = size / 2
  const cy = size / 2

  const baseOffset = cOuter - (Math.min(100, basePct) / 100) * cOuter
  const masterOffset = cInner - (Math.min(100, masterPct) / 100) * cInner

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden
    >
      <circle
        cx={cx}
        cy={cy}
        r={rOuter}
        fill="none"
        stroke="#E8E4DE"
        strokeWidth={stroke}
      />
      <circle
        cx={cx}
        cy={cy}
        r={rOuter}
        fill="none"
        stroke="#2D5A4A"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={cOuter}
        strokeDashoffset={baseOffset}
        transform={`rotate(-90 ${cx} ${cy})`}
        className="transition-all duration-700 ease-out"
      />
      <circle
        cx={cx}
        cy={cy}
        r={rInner}
        fill="none"
        stroke="#E8E4DE"
        strokeWidth={stroke - 1}
      />
      <circle
        cx={cx}
        cy={cy}
        r={rInner}
        fill="none"
        stroke="#6B2D3E"
        strokeWidth={stroke - 1}
        strokeLinecap="round"
        strokeDasharray={cInner}
        strokeDashoffset={masterOffset}
        transform={`rotate(-90 ${cx} ${cy})`}
        className="transition-all duration-700 ease-out"
      />
    </svg>
  )
}
