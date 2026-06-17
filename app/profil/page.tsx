import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ensureProfile, profileDisplayName } from '@/lib/profile'
import ProfileEditor from '@/components/profile/ProfileEditor'
import SignOutButton from '@/components/profile/SignOutButton'
import BottomNav from '@/components/ui/BottomNav'

export const metadata: Metadata = { title: 'Mon profil' }

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/profil')

  const profile = await ensureProfile(supabase, user)
  if (!profile) redirect('/login?redirect=/profil')

  const { count: ownedCount } = await supabase
    .from('user_collections')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'owned')

  const displayName = profileDisplayName(profile, user)

  return (
    <main className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-border px-4 pt-safe-top pb-3">
        <h1 className="text-lg font-semibold">Mon profil</h1>
        <p className="text-xs text-white/40 mt-1">
          Ta collection est liée à ce profil
        </p>
      </header>

      <div className="px-4 pt-5 space-y-6">
        <section className="bg-surface border border-border rounded-card p-4">
          <ProfileEditor profile={profile} email={user.email ?? ''} />
        </section>

        <section className="bg-surface border border-border rounded-card p-4 space-y-3">
          <h2 className="text-sm font-medium">Ma collection</h2>
          <p className="text-2xl font-semibold text-gold">
            {ownedCount ?? 0} carte{(ownedCount ?? 0) !== 1 ? 's' : ''} possédée{(ownedCount ?? 0) !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-white/40">
            Quand tu marques une carte « Possédée », elle est enregistrée sur le profil{' '}
            <span className="text-white/60">{displayName}</span>.
          </p>
          <Link
            href="/collection"
            className="inline-block text-sm text-gold hover:underline"
          >
            Voir ma collection →
          </Link>
        </section>

        <section className="text-center">
          <SignOutButton />
        </section>
      </div>

      <BottomNav active="profil" />
    </main>
  )
}
