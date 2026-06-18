'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  CARD_PHOTOS_BUCKET,
  cardPhotoStoragePath,
  resizeCardPhoto,
} from '@/lib/collection/cardPhoto'

interface Props {
  cardId: string
  userId: string
  initialPhotoUrl: string | null
  canCapture: boolean
  onPhotoChange?: (url: string | null) => void
}

export default function CardPhotoCapture({
  cardId,
  userId,
  initialPhotoUrl,
  canCapture,
  onPhotoChange,
}: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleFile = (file: File | undefined) => {
    if (!file || !canCapture) return
    setError(null)

    startTransition(async () => {
      try {
        const supabase = createClient()
        const blob = await resizeCardPhoto(file)
        const path = cardPhotoStoragePath(userId, cardId)

        const { error: uploadError } = await supabase.storage
          .from(CARD_PHOTOS_BUCKET)
          .upload(path, blob, {
            upsert: true,
            contentType: 'image/jpeg',
            cacheControl: '3600',
          })

        if (uploadError) throw uploadError

        const { data: publicData } = supabase.storage
          .from(CARD_PHOTOS_BUCKET)
          .getPublicUrl(path)

        const url = `${publicData.publicUrl}?t=${Date.now()}`

        const { error: updateError } = await supabase
          .from('user_collections')
          .update({ photo_url: publicData.publicUrl })
          .eq('user_id', userId)
          .eq('card_id', cardId)

        if (updateError) throw updateError

        setPhotoUrl(url)
        onPhotoChange?.(url)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Échec de l’envoi de la photo')
      }
    })
  }

  const removePhoto = () => {
    if (!photoUrl) return
    setError(null)

    startTransition(async () => {
      try {
        const supabase = createClient()
        const path = cardPhotoStoragePath(userId, cardId)

        await supabase.storage.from(CARD_PHOTOS_BUCKET).remove([path])

        const { error: updateError } = await supabase
          .from('user_collections')
          .update({ photo_url: null })
          .eq('user_id', userId)
          .eq('card_id', cardId)

        if (updateError) throw updateError

        setPhotoUrl(null)
        onPhotoChange?.(null)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Échec de la suppression')
      }
    })
  }

  if (!canCapture) {
    return null
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-clay-md border border-border bg-surface text-sm type-body hover:shadow-clay-sm transition-all disabled:opacity-50"
        >
          <Camera size={16} />
          {photoUrl ? 'Reprendre la photo' : 'Photographier la carte'}
        </button>

        {photoUrl && (
          <button
            type="button"
            onClick={removePhoto}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-clay-md border border-border text-sm type-body text-muted hover:text-accent-wine transition-colors disabled:opacity-50"
            aria-label="Supprimer la photo"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-accent-wine text-center">{error}</p>}
    </div>
  )
}
