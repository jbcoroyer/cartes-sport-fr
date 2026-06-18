import type { ReactNode } from 'react'

type Variant = 'wine' | 'forest' | 'ochre' | 'steel' | 'neutral'

const VARIANTS: Record<Variant, string> = {
  wine: 'bg-accent-wine/10 text-accent-wine border-accent-wine/20',
  forest: 'bg-accent-forest/10 text-accent-forest border-accent-forest/20',
  ochre: 'bg-accent-ochre/10 text-accent-ochre border-accent-ochre/20',
  steel: 'bg-accent-steel/10 text-accent-steel border-accent-steel/20',
  neutral: 'bg-panel text-muted border-border',
}

interface Props {
  children: ReactNode
  variant?: Variant
  className?: string
}

export default function ClayBadge({ children, variant = 'neutral', className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide border font-sans ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
