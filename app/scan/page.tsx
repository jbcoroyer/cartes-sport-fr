import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Scanner from '@/components/scanner/Scanner'
import BottomNav from '@/components/ui/BottomNav'

export const metadata: Metadata = { title: 'Scanner' }

export default async function ScanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/scan')

  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-safe-top pb-3 border-b border-border">
        <h1 className="text-lg font-semibold">
          Scanner une carte
        </h1>
      </header>

      {/* Scanner (composant client) */}
      <div className="flex-1 flex flex-col">
        <Scanner userId={user.id} />
      </div>

      <BottomNav active="scan" />
    </main>
  )
}
