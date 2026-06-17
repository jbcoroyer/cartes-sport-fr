import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ImageUploader from '@/components/admin/ImageUploader'

export const metadata: Metadata = { title: 'Admin — Images' }

interface Props {
  searchParams: Promise<{ product?: string; missing?: string }>
}

export default async function AdminImagesPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()

  // Garde-fou : page réservée aux connectés.
  // À durcir plus tard avec un vrai rôle admin (voir note en bas de fichier).
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/admin/images')

  // Liste des produits pour le filtre
  const { data: products } = await supabase
    .from('products')
    .select('id, name, season')
    .order('season', { ascending: false })

  // Cartes — par défaut on n'affiche que celles SANS image
  let query = supabase
    .from('cards')
    .select(`
      id, card_number, player_name, image_url,
      products ( name ),
      teams ( name, short_name ),
      rarities ( name )
    `)
    .order('card_number')
    .limit(60)

  if (params.product) {
    query = query.eq('product_id', params.product)
  }
  // missing=0 affiche tout, sinon uniquement les cartes sans image
  if (params.missing !== '0') {
    query = query.is('image_url', null)
  }

  const { data: cards } = await query

  // Compteurs
  const { count: totalCards } = await supabase
    .from('cards')
    .select('id', { count: 'exact', head: true })

  const { count: withImage } = await supabase
    .from('cards')
    .select('id', { count: 'exact', head: true })
    .not('image_url', 'is', null)

  return (
    <main className="min-h-screen pb-12">
      <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur-md border-b border-border px-4 pt-safe-top pb-3">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h1 className="text-lg font-semibold">Admin — Images des cartes</h1>
          <a
            href="/admin/cards/new"
            className="shrink-0 text-xs text-gold border border-gold/40 rounded-lg px-2.5 py-1.5
                       hover:bg-gold/10 transition-colors whitespace-nowrap"
          >
            ＋ Carte manquante
          </a>
        </div>
        <p className="text-xs text-muted">
          {withImage ?? 0} / {totalCards ?? 0} cartes avec image
        </p>

        {/* Filtres produits */}
        <div className="scroll-x mt-3 -mx-4 px-4">
          <a href="/admin/images" className={`filter-tag ${!params.product ? 'active' : ''}`}>
            Tous
          </a>
          {products?.map((p) => (
            <a
              key={p.id}
              href={`/admin/images?product=${p.id}`}
              className={`filter-tag ${params.product === p.id ? 'active' : ''}`}
            >
              {p.name.replace('Adrenalyn XL Ligue 1 ', 'AXL ')
                     .replace('Topps Chrome UEFA Club Competitions ', 'TC ')}
            </a>
          ))}
        </div>
      </header>

      <section className="px-4 pt-4">
        {(cards?.length ?? 0) === 0 ? (
          <div className="text-center py-16 text-muted text-sm">
            🎉 Toutes les cartes de ce filtre ont une image.
          </div>
        ) : (
          <ImageUploader cards={cards ?? []} />
        )}
      </section>
    </main>
  )
}

// NOTE SÉCURITÉ — À FAIRE avant la prod :
// Cette page est seulement protégée par "utilisateur connecté".
// Pour la réserver à toi seul, ajoute une colonne `role` dans user_profiles
// (ex: 'admin' | 'user') et vérifie ici :
//   const { data: profile } = await supabase
//     .from('user_profiles').select('role').eq('id', user.id).single()
//   if (profile?.role !== 'admin') redirect('/catalogue')
