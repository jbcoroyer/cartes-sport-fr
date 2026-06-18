import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article'
}

export default function ClaySurface({ children, className = '', as: Tag = 'div' }: Props) {
  return <Tag className={`clay-surface ${className}`}>{children}</Tag>
}
