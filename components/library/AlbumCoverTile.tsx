'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import DualProgressRing from '@/components/clay/DualProgressRing'
import ClayBadge from '@/components/clay/ClayBadge'
import type { SetProgress } from '@/lib/collection/progress'

interface Props {
  productId: string
  name: string
  season: string
  publisherName?: string | null
  accentColor: string
  progress: SetProgress
  recentlyUpdated?: boolean
}

export default function AlbumCoverTile({
  productId,
  name,
  season,
  publisherName,
  accentColor,
  progress,
  recentlyUpdated,
}: Props) {
  return (
    <Link href={`/album/${productId}`} className="block group">
      <motion.div
        className="clay-card p-5 md:p-6 flex gap-5 items-stretch min-h-[160px]"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(135deg, ${accentColor}08 0%, transparent 60%), white`,
        }}
      >
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {recentlyUpdated && (
              <ClayBadge variant="forest" className="mb-3">
                Récemment mis à jour
              </ClayBadge>
            )}
            <h2 className="font-serif text-lg md:text-xl font-medium leading-snug line-clamp-2">
              {name}
            </h2>
            <p className="text-sm text-muted mt-1 font-sans">{season}</p>
            {publisherName && (
              <p className="text-xs text-muted mt-0.5 font-sans">{publisherName}</p>
            )}
          </div>
          <div className="flex gap-4 mt-4 text-xs text-muted font-sans">
            <span>Base {progress.baseOwned}/{progress.baseTotal}</span>
            <span>Master {progress.masterOwned}/{progress.masterTotal}</span>
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-center justify-center gap-2">
          <DualProgressRing
            basePct={progress.pctBase}
            masterPct={progress.pctMaster}
            size={80}
          />
          <div className="text-[10px] text-muted text-center font-sans leading-tight">
            <div className="text-accent-forest">{Math.round(progress.pctBase)}% base</div>
            <div className="text-accent-wine">{Math.round(progress.pctMaster)}% master</div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
