'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, LayoutGrid, Sparkles } from 'lucide-react'
import PremiumCard from '@/components/cards/PremiumCard'

const FLOATING_CARDS = [
  { name: 'Mbappé', rarity: 'Invincible', color: '#F59E0B', delay: 0, x: -60, y: -20 },
  { name: 'Haaland', rarity: 'Megacrack', color: '#EC4899', delay: 0.2, x: 50, y: 10 },
  { name: 'Bellingham', rarity: 'Crack', color: '#A855F7', delay: 0.4, x: -20, y: 30 },
]

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-radial" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      {/* Floating cards */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {FLOATING_CARDS.map((card, i) => (
          <motion.div
            key={card.name}
            className="absolute"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 0.6, y: [card.y, card.y - 15, card.y] }}
            transition={{
              opacity: { delay: card.delay + 0.3, duration: 0.8 },
              y: { delay: card.delay, duration: 5 + i, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{ x: card.x }}
          >
            <PremiumCard
              rarityName={card.rarity}
              rarityColorHex={card.color}
              enableTilt={false}
              glowIntensity="high"
              className="w-24 opacity-80"
            >
              <div className="aspect-[3/4] bg-panel/80 flex flex-col items-center justify-center p-2">
                <Sparkles size={16} className="text-gold/50 mb-2" />
                <p className="text-[9px] font-semibold text-center">{card.name}</p>
                <p className="text-[7px] text-white/30 mt-0.5">{card.rarity}</p>
              </div>
            </PremiumCard>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-safe-top pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md"
        >
          <p className="text-2xs text-gold/70 uppercase tracking-[0.2em] mb-4 font-medium">
            Collection premium
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Cartes Sport{' '}
            <span className="text-gradient-gold">FR</span>
          </h1>
          <p className="text-base text-white/50 leading-relaxed mb-10">
            Catalogue, collection et cotes de marché pour tes cartes Panini &amp; Topps.
            Suis ta progression, complète tes albums.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="btn-gold flex items-center justify-center gap-2 py-3.5 px-6">
              Commencer
              <ArrowRight size={18} />
            </Link>
            <Link href="/catalogue" className="btn-ghost flex items-center justify-center gap-2 py-3.5 px-6">
              <LayoutGrid size={18} />
              Explorer le catalogue
            </Link>
          </div>
        </motion.div>

        {/* Stats teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 flex gap-8 text-center"
        >
          {[
            { value: 'Panini', label: 'Adrenalyn XL' },
            { value: 'Topps', label: 'Chrome UEFA' },
            { value: '100%', label: 'Gratuit' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-sm font-semibold text-gold">{stat.value}</p>
              <p className="text-2xs text-white/35 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
