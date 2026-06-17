import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NewCardForm from '@/components/admin/NewCardForm'

export const metadata: Metadata = { title: 'Admin — Ajouter une carte' }

export default async function NewCardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/admin/cards/new')

  const { data: products } = await supabase
    .from('products')
    .select('id, name, season')
    .order('season', { ascending: false })

  const { data: teams } = await supabase
    .from('teams')
    .select('id, name')
    .order('name')

  const { data: rarities } = await supabase
    .from('rarities')
    .select('id, name, product_id')
    .order('name')

  return (
    <main className="min-h-screen pb-12">
      <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-border px-4 pt-safe-top pb-3">
        <h1 className="text-lg font-semibold">Ajouter une carte manquante</h1>
        <p className="text-xs text-white/40 mt-1">
          Pour les cartes absentes du catalogue (parallèles, variantes non répertoriées…)
        </p>
      </header>

      <section className="px-4 pt-5">
        <NewCardForm
          products={products ?? []}
          teams={teams ?? []}
          rarities={rarities ?? []}
        />
      </section>
    </main>
  )
}

// NOTE SÉCURITÉ — même remarque que /admin/images :
// réserver cette page à un vrai rôle admin avant la mise en production.
