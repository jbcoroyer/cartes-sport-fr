import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Layers, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ensureProfile, profileDisplayName } from '@/lib/profile'
import ProfileEditor from '@/components/profile/ProfileEditor'
import SignOutButton from '@/components/profile/SignOutButton'
import PageHeader from '@/components/ui/PageHeader'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import Reveal from '@/components/motion/Reveal'

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
    <main className="min-h-screen">
      <PageHeader
        title="Mon profil"
        subtitle="Ta collection est liée à ce compte"
      />

      <div className="page-container pt-8 md:pt-10 pb-10 space-y-8">
        <Reveal>
          <section className="glass-panel rounded-xl2 p-5">
            <ProfileEditor profile={profile} email={user.email ?? ''} />
          </section>
        </Reveal>

        <Reveal delay={0.1}>
          <Link
            href="/collection"
            className="glass-panel rounded-xl2 p-5 block group transition-all hover:border-gold/25"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl2 bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Layers size={22} className="text-gold" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">Ma collection</h2>
                  <p className="text-2xl font-bold text-gold mt-0.5">
                    <AnimatedCounter value={ownedCount ?? 0} />
                    <span className="text-sm font-normal text-white/40 ml-1">cartes</span>
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/25 group-hover:text-gold transition-colors" />
            </div>
          </Link>
        </Reveal>

        <Reveal delay={0.15}>
          <section className="text-center pt-4">
            <SignOutButton />
          </section>
        </Reveal>
      </div>
    </main>
  )
}
