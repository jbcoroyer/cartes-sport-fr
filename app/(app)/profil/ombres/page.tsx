import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/supabase/auth'
import { getCatalogProducts } from '@/lib/catalog'
import BackButton from '@/components/ui/BackButton'
import ShadowsPageClient from '@/components/shadows/ShadowsPageClient'

export const metadata: Metadata = { title: 'Mur des Ombres' }

export default async function ShadowsPage() {
  const { user } = await getAuthUser()
  if (!user) redirect('/login?redirect=/profil/ombres')

  const products = await getCatalogProducts()
  const activeProducts = products
    .filter((p) => p.is_active)
    .map((p) => ({ id: p.id, name: p.name }))

  return (
    <main className="min-h-screen bg-museum">
      <div className="page-container py-10 md:py-14">
        <BackButton href="/profil" label="Profil" />
        <header className="mt-6 mb-10">
          <h1 className="type-hero text-display-sm">Mur des Ombres</h1>
          <p className="type-body text-muted mt-2 max-w-lg">
            Les cartes manquantes — silhouettes qui attendent d&apos;être acquises.
          </p>
        </header>
        <ShadowsPageClient products={activeProducts} userId={user.id} />
      </div>
    </main>
  )
}
