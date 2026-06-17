'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/catalogue')
        router.refresh()
      }}
      className="text-sm text-white/40 hover:text-missing transition-colors"
    >
      Se déconnecter
    </button>
  )
}
