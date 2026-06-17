import type { ReactNode } from 'react'

interface Props {
  title: ReactNode
  subtitle?: string
  right?: ReactNode
  children?: ReactNode
  className?: string
  sticky?: boolean
}

export default function PageHeader({
  title,
  subtitle,
  right,
  children,
  className = '',
  sticky = true,
}: Props) {
  return (
    <header
      className={`${sticky ? 'sticky top-16 z-40' : ''} glass-panel border-b border-border/60 ${className}`}
    >
      <div className="page-container pb-4 pt-4">
        <div className="flex items-center justify-between gap-4 mb-1">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">{title}</h1>
            {subtitle && (
              <p className="text-sm text-white/50 mt-1 truncate">{subtitle}</p>
            )}
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </div>
        {children}
      </div>
    </header>
  )
}
