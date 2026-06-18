import Image from 'next/image'
import type { ReactNode } from 'react'
import { packGradient } from '@/lib/collection/packTheme'
import type { PackTheme } from '@/lib/collection/packTheme'

interface Props {
  eyebrow: string
  title: string
  subtitle?: string | null
  crestUrl?: string | null
  crestFallback?: string
  packTheme?: PackTheme
  surfaceBackground?: string
  forceLightText?: boolean
  accentColor?: string
  titleVariant?: 'hero' | 'title'
  children?: ReactNode
}

export default function EntityHeader({
  eyebrow,
  title,
  subtitle,
  crestUrl,
  crestFallback,
  packTheme,
  surfaceBackground,
  forceLightText,
  accentColor = '#4A6278',
  titleVariant = 'hero',
  children,
}: Props) {
  const titleClass =
    titleVariant === 'hero'
      ? 'type-hero text-display-sm md:text-display max-w-3xl'
      : 'type-title text-2xl md:text-3xl max-w-2xl'

  const silkLight = forceLightText ?? packTheme?.silkLight ?? false
  const textTone = silkLight ? 'text-silk-light' : 'text-silk'
  const metaTone = silkLight ? 'text-silk-light-muted' : 'text-silk-muted'
  const textured = Boolean(packTheme || surfaceBackground)

  const background =
    surfaceBackground ??
    (packTheme
      ? packGradient(packTheme.c1, packTheme.c2)
      : `linear-gradient(160deg, ${accentColor}14 0%, transparent 55%), white`)

  return (
    <header className="collection-entity mb-10 md:mb-14 shadow-pack">
      <div className="collection-entity-surface" style={{ background }} aria-hidden="true" />

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex items-start gap-5 md:gap-6">
          {packTheme && (
            <div className="hidden sm:flex w-24 h-8 md:w-28 md:h-9 shrink-0 items-center justify-center opacity-95">
              <Image
                src={`/logos/${packTheme.logo}.png`}
                alt=""
                width={112}
                height={36}
                className={`object-contain w-full h-full ${
                  packTheme.logo === 'panini' ? 'max-h-7' : 'max-h-8'
                }`}
              />
            </div>
          )}
          {(crestUrl || crestFallback) && (
            <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 flex items-center justify-center rounded-full bg-white/12 ring-1 ring-white/20 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              {crestUrl ? (
                <Image
                  src={crestUrl}
                  alt=""
                  width={80}
                  height={80}
                  className="object-contain w-full h-full drop-shadow-clay-sm"
                />
              ) : (
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/10 flex items-center justify-center text-xl md:text-2xl type-subtitle ${textured ? (silkLight ? 'text-silk-light' : 'text-silk') : 'text-muted'}`}
                >
                  {crestFallback}
                </div>
              )}
            </div>
          )}
          <div className="flex-1 min-w-0 pt-0.5">
            <p className={`type-eyebrow mb-3 ${textured ? metaTone : 'text-muted'}`}>
              {eyebrow}
            </p>
            <h1 className={`${titleClass} ${textured ? textTone : 'text-ink'}`}>{title}</h1>
            {subtitle && (
              <p className={`type-body mt-2 ${textured ? metaTone : 'text-muted'}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {children && <div className="mt-6 md:mt-8">{children}</div>}
      </div>
    </header>
  )
}
