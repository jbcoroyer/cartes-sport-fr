import Link from 'next/link'

type Tab = 'catalogue' | 'scan' | 'collection' | 'profil'

const TABS = [
  { id: 'catalogue' as Tab, label: 'Catalogue', href: '/catalogue', icon: '◫' },
  { id: 'scan'      as Tab, label: 'Scanner',   href: '/scan',      icon: '⊡' },
  { id: 'collection'as Tab, label: 'Collection',href: '/collection', icon: '♣' },
  { id: 'profil'    as Tab, label: 'Profil',    href: '/profil',    icon: '◎' },
]

export default function BottomNav({ active }: { active: Tab }) {
  return (
    <nav className="bottom-nav">
      <div className="flex items-stretch h-16">
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors
              ${active === tab.id
                ? 'text-gold'
                : 'text-white/30 hover:text-white/60'
              }`}
          >
            <span className={`text-xl leading-none ${active === tab.id ? 'text-gold' : ''}`}>
              {tab.icon}
            </span>
            <span className="text-[10px] font-medium tracking-wide">
              {tab.label}
            </span>
            {active === tab.id && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-gold" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  )
}
