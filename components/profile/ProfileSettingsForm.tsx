'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/lib/types/database'
import ClayButton from '@/components/clay/ClayButton'

interface Team {
  id: string
  name: string
}

interface Props {
  profile: UserProfile
  teams: Team[]
}

export default function ProfileSettingsForm({ profile, teams }: Props) {
  const router = useRouter()
  const [favoriteTeamId, setFavoriteTeamId] = useState(profile.favorite_team_id ?? '')
  const [isPublic, setIsPublic] = useState(profile.is_public ?? false)
  const [showcasePublic, setShowcasePublic] = useState(profile.showcase_public ?? false)
  const [notifyThreshold, setNotifyThreshold] = useState(profile.notify_threshold ?? 90)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const save = () => {
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase
        .from('user_profiles')
        .update({
          favorite_team_id: favoriteTeamId || null,
          is_public: isPublic,
          showcase_public: showcasePublic,
          notify_threshold: notifyThreshold,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (error) setMessage(error.message)
      else {
        setMessage('Paramètres enregistrés.')
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <label className="block text-xs text-muted mb-1.5">Club de cœur</label>
        <select
          value={favoriteTeamId}
          onChange={(e) => setFavoriteTeamId(e.target.value)}
          className="search-input"
        >
          <option value="">Aucun</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="rounded"
        />
        <span className="text-sm">Profil public</span>
      </label>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={showcasePublic}
          onChange={(e) => setShowcasePublic(e.target.checked)}
          className="rounded"
        />
        <span className="text-sm">Mur d&apos;exposition public</span>
      </label>

      <div>
        <label className="block text-xs text-muted mb-1.5">
          Seuil de notification complétion ({notifyThreshold}%)
        </label>
        <input
          type="range"
          min={50}
          max={100}
          step={5}
          value={notifyThreshold}
          onChange={(e) => setNotifyThreshold(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {message && <p className="text-sm text-muted">{message}</p>}

      <ClayButton onClick={save} disabled={isPending} className="w-full">
        {isPending ? 'Enregistrement…' : 'Enregistrer'}
      </ClayButton>

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted mb-3">Export de la collection</p>
        <a href="/api/export/collection" className="btn-ghost inline-block text-sm">
          Télécharger CSV
        </a>
      </div>
    </div>
  )
}
