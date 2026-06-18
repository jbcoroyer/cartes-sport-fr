'use client'

import { motion } from 'framer-motion'

interface Props {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  showLabel?: boolean
  labelClassName?: string
}

export default function CircularProgress({
  value,
  size = 64,
  strokeWidth = 4,
  className = '',
  showLabel = true,
  labelClassName = '',
}: Props) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, value))
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-panel"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7A5A30" />
            <stop offset="50%" stopColor="#B8924F" />
            <stop offset="100%" stopColor="#9A7340" />
          </linearGradient>
        </defs>
      </svg>
      {showLabel && (
        <span className={`absolute text-xs font-data text-ink ${labelClassName}`}>
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  )
}
