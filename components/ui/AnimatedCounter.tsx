'use client'

import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

interface Props {
  value: number
  duration?: number
  decimals?: number
  suffix?: string
  className?: string
}

export default function AnimatedCounter({
  value,
  duration = 1.2,
  decimals = 0,
  suffix = '',
  className = '',
}: Props) {
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 })
  const display = useTransform(spring, (v) => {
    const formatted = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString('fr-FR')
    return `${formatted}${suffix}`
  })

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span className={className}>{display}</motion.span>
}
