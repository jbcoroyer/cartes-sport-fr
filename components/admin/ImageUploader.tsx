'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface CardRow {
  id: string
  card_number: string
  player_name: string
  image_url: string | null
  products: { name: string } | null
  teams: { name: string; short_name: string | null } | null
  rarities: { name: string } | null
}

interface Props {
  cards: CardRow[]
}

type UploadState = 'idle' | 'uploading' | 'done' | 'error'

export default function ImageUploader({ cards }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [states, setStates] = useState<Record<string, UploadState>>({})
  const [uploaded, setUploaded] = useState<Record<string, string>>({})
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const handleFile = async (card: CardRow, file: File) => {
    setStates((s) => ({ ...s, [card.id]: 'uploading' }))

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const path = `${card.id}.${ext}`

      const { error: uploadError } = await supabase
        .storage
        .from('card-images')
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase
        .storage
        .from('card-images')
        .getPublicUrl(path)

      const finalUrl = `${publicUrl}?v=${Date.now()}`

      const { error: updateError } = await supabase
        .from('cards')
        .update({ image_url: finalUrl })
        .eq('id', card.id)

      if (updateError) throw updateError

      setUploaded((u) => ({ ...u, [card.id]: finalUrl }))
      setStates((s) => ({ ...s, [card.id]: 'done' }))
    } catch (err) {
      console.error('Upload échoué:', err)
      setStates((s) => ({ ...s, [card.id]: 'error' }))
    }
  }

  return (
    <div className="card-grid">
      {cards.map((card) => {
        const state = states[card.id] ?? 'idle'
        const currentImage = uploaded[card.id] ?? card.image_url

        return (
          <div key={card.id} className="card-item">
            <button
              onClick={() => inputRefs.current[card.id]?.click()}
              className="relative aspect-[3/4] bg-panel w-full overflow-hidden block"
              disabled={state === 'uploading'}
            >
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={card.player_name}
                  fill
                  sizes="(max-width: 640px) 45vw, 180px"
                  className="object-contain p-2"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted/80">
                  <span className="text-2xl">＋</span>
                  <span className="text-[10px]">Ajouter une image</span>
                </div>
              )}

              {state === 'uploading' && (
                <div className="absolute inset-0 bg-canvas/70 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {state === 'done' && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-owned flex items-center justify-center">
                  <span className="text-[10px] text-ink">✓</span>
                </div>
              )}
              {state === 'error' && (
                <div className="absolute inset-0 bg-missing/20 flex items-center justify-center">
                  <span className="text-[10px] text-missing">Erreur — réessayer</span>
                </div>
              )}
            </button>

            <input
              ref={(el) => { inputRefs.current[card.id] = el }}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(card, file)
              }}
            />

            <div className="p-2 space-y-0.5">
              <p className="text-[11px] font-medium leading-tight truncate">
                #{card.card_number} · {card.player_name}
              </p>
              <p className="text-[10px] text-muted truncate">
                {card.teams?.short_name ?? card.teams?.name ?? '—'}
                {card.rarities?.name && card.rarities.name !== 'Base' && (
                  <span className="text-gold ml-1">{card.rarities.name}</span>
                )}
              </p>
            </div>
          </div>
        )
      })}

      <button
        onClick={() => router.refresh()}
        className="col-span-full mt-4 py-3 rounded-xl border border-border text-sm text-muted
                   hover:border-gold/50 transition-colors"
      >
        Rafraîchir la liste
      </button>
    </div>
  )
}
