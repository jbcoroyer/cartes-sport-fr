'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
  href?: string
  label?: string
  className?: string
}

export default function BackButton({ href, label, className = '' }: Props) {
  const baseClass = `inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors ${className}`

  if (href) {
    return (
      <Link href={href} className={baseClass} aria-label="Retour">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-panel border border-border">
          <ChevronLeft size={16} />
        </span>
        {label && <span className="font-sans">{label}</span>}
      </Link>
    )
  }

  return (
    <button
      onClick={() => history.back()}
      className={baseClass}
      aria-label="Retour"
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-panel border border-border">
        <ChevronLeft size={16} />
      </span>
      {label && <span className="font-sans">{label}</span>}
    </button>
  )
}
