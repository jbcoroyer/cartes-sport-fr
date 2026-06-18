import { cache } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/profile'
import type { UserProfile } from '@/lib/types/database'

export const getAuthUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, user }
})

export const getAuthUserWithProfile = cache(async (): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>
  user: User
  profile: UserProfile | null
} | null> => {
  const { supabase, user } = await getAuthUser()
  if (!user) return null
  const profile = await ensureProfile(supabase, user)
  return { supabase, user, profile }
})
