'use client'

import { useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { getRarityStyle } from './RarityBadge'

interface Props {
  children: ReactNode
  rarityName?: string | null
  rarityColorHex?: string | null
  className?: string
  enableTilt?: boolean
  glowIntensity?: 'low' | 'medium' | 'high'
}

export default function PremiumCard({
  children,
  rarityName,
  rarityColorHex,
  className = '',
  enableTilt = true,
  glowIntensity = 'medium',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 })

  const rarityStyle = rarityName ? getRarityStyle(rarityName, rarityColorHex) : null
  const glowOpacity = glowIntensity === 'low' ? 0.15 : glowIntensity === 'high' ? 0.45 : 0.3

  const handleMouseMove = (e: MouseEvent) => {
    if (!enableTilt || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    x.set(px)
    y.set(py)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`group relative ${className}`}
      style={enableTilt ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={enableTilt ? { scale: 0.97 } : undefined}
    >
      {/* Rarity glow */}
      {rarityStyle && isHovered && (
        <div
          className="absolute -inset-1 rounded-card blur-xl transition-opacity duration-300 pointer-events-none"
          style={{ backgroundColor: rarityStyle.glow, opacity: glowOpacity }}
        />
      )}

      <div className="card-premium relative overflow-hidden">
        {/* Holo sweep */}
        <div className="holo-overlay motion-reduce:opacity-0" />

        {/* Gold shine on hover */}
        <div
          className={`absolute inset-0 bg-card-shine pointer-events-none transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {children}
      </div>
    </motion.div>
  )
}
