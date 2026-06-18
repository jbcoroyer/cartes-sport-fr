'use client'

import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'ghost'
}

export default function ClayButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: Props) {
  const base = variant === 'primary' ? 'btn-clay' : 'btn-ghost'
  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  )
}
