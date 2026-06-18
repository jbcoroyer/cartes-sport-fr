'use client'

import { useRef, useState, type ReactNode, type MouseEvent, type TouchEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface Props {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  photoUrl?: string | null
}

const SIZES = {
  sm: 'w-[100px]',
  md: 'w-[140px] md:w-[160px]',
  lg: 'w-[200px] md:w-[240px]',
}

export default function CardSlot({
  children,
  className = '',
  size = 'md',
  interactive = true,
  photoUrl,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 280, damping: 28 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 280, damping: 28 })
  const contentX = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 280, damping: 28 })
  const contentY = useSpring(useTransform(y, [-0.5, 0.5], [-4, 4]), { stiffness: 280, damping: 28 })

  const handlePointer = (clientX: number, clientY: number) => {
    if (!interactive || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((clientX - rect.left) / rect.width - 0.5)
    y.set((clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseMove = (e: MouseEvent) => handlePointer(e.clientX, e.clientY)
  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0]
    if (touch) handlePointer(touch.clientX, touch.clientY)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div className={`perspective-[800px] ${SIZES[size]} ${className}`}>
      <motion.div
        ref={ref}
        className="relative aspect-[5/7] shadow-clay"
        style={
          interactive
            ? { rotateX, rotateY, transformStyle: 'preserve-3d' }
            : undefined
        }
        onMouseMove={interactive ? handleMouseMove : undefined}
        onMouseLeave={reset}
        onTouchMove={interactive ? handleTouchMove : undefined}
        onTouchEnd={reset}
      >
        <div
          className="absolute inset-1 rounded-clay bg-panel/60"
          style={{ transform: 'translateZ(-12px)' }}
        />
        <div className="absolute inset-0 rounded-clay bg-surface border border-border overflow-hidden">
          {photoUrl ? (
            <>
              <img
                src={photoUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/88 to-transparent pointer-events-none" />
            </>
          ) : (
            <div className="absolute inset-0 card-slot-placeholder" aria-hidden="true" />
          )}
          <motion.div
            className={`relative h-full flex flex-col p-3 md:p-4 ${
              photoUrl ? 'justify-end' : 'justify-between'
            }`}
            style={interactive ? { x: contentX, y: contentY } : undefined}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
