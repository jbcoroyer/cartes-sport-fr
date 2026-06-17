'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutGrid, ScanLine, Layers, User } from 'lucide-react'

type Tab = 'catalogue' | 'scan' | 'collection' | 'profil'

const TABS: { id: Tab; label: string; href: string; Icon: typeof LayoutGrid }[] = [
  { id: 'catalogue', label: 'Catalogue', href: '/catalogue', Icon: LayoutGrid },
  { id: 'scan', label: 'Scanner', href: '/scan', Icon: ScanLine },
  { id: 'collection', label: 'Collection', href: '/collection', Icon: Layers },
  { id: 'profil', label: 'Profil', href: '/profil', Icon: User },
]

export default function BottomNav({ active }: { active: Tab }) {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav">
      <div className="relative flex items-stretch h-[4.25rem] max-w-lg mx-auto px-2">
        {TABS.map((tab) => {
          const isActive = active === tab.id || pathname.startsWith(tab.href) && tab.id === 'collection'
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 z-10"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-x-2 inset-y-2 rounded-xl2 bg-gold/10 border border-gold/20"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <tab.Icon
                size={20}
                strokeWidth={isActive ? 2.25 : 1.75}
                className={`relative z-10 transition-colors duration-200 ${
                  isActive ? 'text-gold' : 'text-white/35'
                }`}
              />
              <span
                className={`relative z-10 text-[10px] font-medium tracking-wide transition-colors duration-200 ${
                  isActive ? 'text-gold' : 'text-white/35'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
