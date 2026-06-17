import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { Database, UserProfile } from '@/lib/types/database'

type AppSupabase = SupabaseClient<Database>

export function profileDisplayName(
  profile: Pick<UserProfile, 'username'> | null,
  user?: User | null
): string {
  if (profile?.username) return profile.username
  const meta = user?.user_metadata
  return (
    meta?.full_name ??
    meta?.name ??
    user?.email?.split('@')[0] ??
    'Mon profil'
  )
}

export async function getProfile(
  supabase: AppSupabase,
  userId: string
): Promise<UserProfile | null> {
  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  return data
}

/** Garantit un profil pour l'utilisateur connecté (lien collection ↔ profil). */
export async function ensureProfile(
  supabase: AppSupabase,
  user: User
): Promise<UserProfile | null> {
  const existing = await getProfile(supabase, user.id)
  if (existing) return existing

  const username = profileDisplayName(null, user)
  const avatar =
    user.user_metadata?.avatar_url ??
    user.user_metadata?.picture ??
    null

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(
      { id: user.id, username, avatar_url: avatar },
      { onConflict: 'id' }
    )
    .select()
    .single()

  if (error) {
    console.error('ensureProfile:', error.message)
    return null
  }
  return data
}
