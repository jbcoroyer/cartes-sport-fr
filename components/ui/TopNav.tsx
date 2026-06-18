'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { User } from 'lucide-react'

const TABS = [
  { id: 'library', label: 'Bibliothèque', href: '/' },
  { id: 'profil', label: 'Profil', href: '/profil' },
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
  if (tabId === 'library') {
    return pathname === '/' || pathname.startsWith('/album') || pathname.startsWith('/carte')
  }
  if (tabId === 'profil') {
    return pathname.startsWith('/profil')
  }
  return pathname === href
}

export default function TopNav({ user }: Props) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-museum border-b border-border safe-top shadow-clay-sm">
      <div className="h-14 md:h-16 page-container flex items-center justify-between gap-6">
        <Link
          href="/"
          className="shrink-0 font-serif text-sm md:text-base font-medium tracking-tight text-ink"
        >
          Cartes Sport FR
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {TABS.map((tab) => {
            const active = isTabActive(pathname, tab.href, tab.id)
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`px-3 py-2 text-xs sm:text-sm font-medium transition-colors rounded-clay ${
                  active ? 'text-ink bg-surface shadow-soft' : 'text-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>

        <Link
          href={user?.href ?? '/login'}
          className="shrink-0 relative w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden bg-panel border border-border"
          aria-label={user ? 'Mon profil' : 'Se connecter'}
        >
          {user?.avatarUrl ? (
            <Image src={user.avatarUrl} alt="" fill className="object-cover" sizes="36px" />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-xs font-medium text-muted">
              {user ? user.displayName[0]?.toUpperCase() : <User size={15} strokeWidth={1.5} />}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
