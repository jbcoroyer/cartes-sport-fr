'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/lib/types/database'

interface Props {
  profile: UserProfile
  email: string
}

export default function ProfileEditor({ profile, email }: Props) {
  const router = useRouter()
  const [username, setUsername] = useState(profile.username ?? '')
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed) {
      setMessage({ type: 'err', text: 'Le pseudo ne peut pas être vide.' })
      return
    }

    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase
        .from('user_profiles')
        .update({ username: trimmed, updated_at: new Date().toISOString() })
        .eq('id', profile.id)

      if (error) {
        setMessage({ type: 'err', text: error.message })
        return
      }

      setMessage({ type: 'ok', text: 'Profil mis à jour.' })
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-panel border border-border shrink-0">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt=""
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl text-accent-ochre">
              {(username || email)[0]?.toUpperCase() ?? '?'}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm type-subtitle truncate">{username || 'Sans pseudo'}</p>
          <p className="text-xs text-muted type-caption truncate">{email}</p>
        </div>
      </div>

      <div>
        <label className="block text-xs text-muted mb-1.5">Pseudo (affiché sur ta collection)</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={40}
          className="search-input"
          placeholder="ex: Ma collection UCC"
        />
      </div>

      {message && (
        <p className={`text-sm ${message.type === 'ok' ? 'text-owned' : 'text-missing'}`}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn-clay w-full py-3 rounded-clay-md disabled:opacity-40"
      >
        {isPending ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  )
}
