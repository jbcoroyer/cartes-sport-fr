import Image from 'next/image'
import { Layers, Sparkles } from 'lucide-react'

export function isAdrenalynProduct(name: string) {
  return name.includes('Adrenalyn')
}

export function productDisplayName(name: string) {
  return name
    .replace('Adrenalyn XL Ligue 1 ', 'Adrenalyn XL ')
    .replace('Topps Chrome UEFA Club Competitions ', 'Topps Chrome ')
}

interface Props {
  src: string | null
  alt: string
  adrenalyn?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export default function ProductCoverStage({
  src,
  alt,
  adrenalyn = false,
  size = 'md',
  className = '',
}: Props) {
  const stageH = size === 'sm' ? 'h-[72px]' : 'h-[108px]'
  const imgMax = size === 'sm' ? 'max-h-[52px]' : 'max-h-[80px]'
  const iconSize = size === 'sm' ? 20 : 28

  return (
    <div
      className={`product-cover-stage ${adrenalyn ? 'product-cover-stage--gold' : 'product-cover-stage--chrome'} ${stageH} ${className}`}
    >
      <div className="product-cover-stage__glow" aria-hidden />
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={size === 'sm' ? 80 : 120}
          height={size === 'sm' ? 100 : 140}
          className={`relative z-10 ${imgMax} w-auto object-contain mix-blend-lighten drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-[1.04] group-hover:-translate-y-0.5`}
          sizes={size === 'sm' ? '80px' : '120px'}
        />
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center gap-1.5">
          {adrenalyn ? (
            <Layers size={iconSize} className="text-gold/40" strokeWidth={1.25} />
          ) : (
            <Sparkles size={iconSize} className="text-cyan-400/40" strokeWidth={1.25} />
          )}
        </div>
      )}
    </div>
  )
}
