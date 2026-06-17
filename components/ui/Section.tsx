import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  action?: ReactNode
  className?: string
}

export default function Section({ title, children, action, className = '' }: Props) {
  return (
    <section className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}
