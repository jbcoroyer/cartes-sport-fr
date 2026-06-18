import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/profile'
import BackButton from '@/components/ui/BackButton'
import ProfileSettingsForm from '@/components/profile/ProfileSettingsForm'

export const metadata: Metadata = { title: 'Paramètres' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/profil/parametres')

  const profile = await ensureProfile(supabase, user)
  if (!profile) redirect('/login?redirect=/profil/parametres')

  const { data: teams } = await supabase
    .from('teams')
    .select('id, name')
    .order('name')

  return (
    <main className="min-h-screen bg-museum">
      <div className="page-container py-10 max-w-md mx-auto">
        <BackButton href="/profil" label="Profil" />
        <h1 className="type-title text-2xl mt-6 mb-8">Paramètres</h1>
        <div className="clay-card p-6">
          <ProfileSettingsForm profile={profile} teams={teams ?? []} />
        </div>
      </div>
    </main>
  )
}
