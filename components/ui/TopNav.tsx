'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutGrid, ScanLine, Layers, User } from 'lucide-react'

const TABS = [
  { id: 'catalogue', label: 'Catalogue', href: '/catalogue', Icon: LayoutGrid },
  { id: 'scan', label: 'Scanner', href: '/scan', Icon: ScanLine },
  { id: 'collection', label: 'Collection', href: '/collection', Icon: Layers },
  { id: 'profil', label: 'Profil', href: '/profil', Icon: User },
] as const

export interface TopNavUser {
  displayName: string
  avatarUrl: string | null
  href: string
}

interface Props {
  user: TopNavUser | null
}

function isTabActive(pathname: string, href: string, tabId: string) {
  if (tabId === 'collection') {
    return pathname === href || pathname.startsWith('/collection/')
  }
  if (tabId === 'catalogue') {
    return pathname === href || pathname.startsWith('/catalogue/')
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function TopNav({ user }: Props) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-border/60 safe-top">
      <div className="h-16 max-w-[1500px] mx-auto px-4 md:px-8 lg:px-12 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0 font-semibold tracking-tight text-sm md:text-base">
          Cartes Sport <span className="text-gold">FR</span>
        </Link>

        {/* Nav links */}
        <nav className="flex-1 flex items-center justify-center gap-0.5 sm:gap-1 min-w-0">
          {TABS.map((tab) => {
            const active = isTabActive(pathname, tab.href, tab.id)
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl2 z-10"
                aria-label={tab.label}
              >
                {active && (
                  <motion.div
                    layoutId="top-nav-pill"
                    className="absolute inset-0 rounded-xl2 bg-gold/10 border border-gold/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.Icon
                  size={18}
                  strokeWidth={active ? 2.25 : 1.75}
                  className={`relative z-10 shrink-0 transition-colors duration-200 ${
                    active ? 'text-gold' : 'text-white/40'
                  }`}
                />
                <span
                  className={`relative z-10 hidden sm:inline text-xs font-medium transition-colors duration-200 ${
                    active ? 'text-gold' : 'text-white/40'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Avatar */}
        <Link
          href={user?.href ?? '/login'}
          className="shrink-0 relative w-9 h-9 rounded-full overflow-hidden bg-panel border border-border/80 ring-1 ring-white/5 hover:ring-gold/30 transition-all"
          aria-label={user ? 'Mon profil' : 'Se connecter'}
        >
          {user?.avatarUrl ? (
            <Image src={user.avatarUrl} alt="" fill className="object-cover" sizes="36px" />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-xs font-semibold text-gold">
              {user ? user.displayName[0]?.toUpperCase() : <User size={16} className="text-white/40" />}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
