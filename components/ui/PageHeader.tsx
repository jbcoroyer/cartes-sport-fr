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
      className={`${sticky ? 'sticky top-14 md:top-16 z-40' : ''} bg-canvas border-b border-border ${className}`}
    >
      <div className="page-container py-8 md:py-10">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h1 className="type-hero text-display-sm md:text-display">{title}</h1>
            {subtitle && (
              <p className="type-body text-sm md:text-base text-muted mt-2 max-w-xl">{subtitle}</p>
            )}
          </div>
          {right && <div className="shrink-0 pt-1">{right}</div>}
        </div>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  )
}
