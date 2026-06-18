import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  onClick?: () => void
  as?: 'div' | 'article' | 'button'
}

export default function ClayCard({
  children,
  className = '',
  onClick,
  as: Tag = 'div',
}: Props) {
  const interactive = Tag === 'button' || onClick
  return (
    <Tag
      className={`clay-card ${interactive ? 'cursor-pointer active:scale-[0.99]' : ''} ${className}`}
      onClick={onClick}
      type={Tag === 'button' ? 'button' : undefined}
    >
      {children}
    </Tag>
  )
}
