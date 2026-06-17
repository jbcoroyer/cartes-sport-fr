import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/landing/Hero'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/collection')
  }

  return (
    <main>
      <Hero />
    </main>
  )
}
