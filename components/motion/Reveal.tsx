import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
}

/** Animation CSS légère — pas de bundle framer-motion. */
export default function Reveal({ children, delay = 0, className = '' }: Props) {
  return (
    <div
      className={`reveal-in ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}
