import { getAuthUserWithProfile } from '@/lib/supabase/auth'
import { profileDisplayName } from '@/lib/profile'
import TopNav from '@/components/ui/TopNav'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAuthUserWithProfile()

  const navUser = session?.profile
    ? {
        displayName: profileDisplayName(session.profile, session.user),
        avatarUrl: session.profile.avatar_url ?? null,
        href: '/profil',
      }
    : null

  return (
    <>
      <TopNav user={navUser} />
      {children}
    </>
  )
}
