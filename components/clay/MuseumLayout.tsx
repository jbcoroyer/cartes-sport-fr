import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export default function MuseumLayout({ children, className = '' }: Props) {
  return (
    <main className={`min-h-screen bg-museum ${className}`}>
      <div className="page-container py-8 md:py-12">{children}</div>
    </main>
  )
}
