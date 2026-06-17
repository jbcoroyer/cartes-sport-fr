import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Scanner from '@/components/scanner/Scanner'
import PageHeader from '@/components/ui/PageHeader'

export const metadata: Metadata = { title: 'Scanner' }

export default async function ScanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/scan')

  return (
    <main className="min-h-screen bg-canvas flex flex-col">
      <PageHeader
        title="Scanner une carte"
        subtitle="Identification instantanée par OCR"
        sticky={false}
      />

      <div className="flex-1 flex flex-col">
        <Scanner userId={user.id} />
      </div>
    </main>
  )
}
