import TopNav from '@/components/ui/TopNav'
import { createClient } from '@/lib/supabase/server'
import { ensureProfile, profileDisplayName } from '@/lib/profile'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let navUser = null
  if (user) {
    const profile = await ensureProfile(supabase, user)
    navUser = {
      displayName: profileDisplayName(profile, user),
      avatarUrl: profile?.avatar_url ?? null,
      href: '/profil',
    }
  }

  return (
    <>
      <TopNav user={navUser} />
      {children}
    </>
  )
}
