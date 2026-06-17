'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
  href?: string
  className?: string
}

export default function BackButton({ href, className = '' }: Props) {
  const baseClass = `flex items-center justify-center w-9 h-9 rounded-full
    bg-panel/80 backdrop-blur-sm border border-border/80
    text-ink/70 hover:text-ink hover:border-gold/30 transition-all ${className}`

  if (href) {
    return (
      <Link href={href} className={baseClass} aria-label="Retour">
        <ChevronLeft size={18} />
      </Link>
    )
  }

  return (
    <button
      onClick={() => history.back()}
      className={`absolute top-3 left-3 z-20 ${baseClass}`}
      aria-label="Retour"
    >
      <ChevronLeft size={18} />
    </button>
  )
}
