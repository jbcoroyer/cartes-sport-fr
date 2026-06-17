import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ensureProfile, profileDisplayName } from '@/lib/profile'
import PageHeader from '@/components/ui/PageHeader'
import Section from '@/components/ui/Section'
import CollectionStats from '@/components/collection/CollectionStats'
import SeriesGrid from '@/components/collection/SeriesGrid'
import CollectionByProduct from '@/components/collection/CollectionByProduct'
import CollectionEmpty from '@/components/collection/CollectionEmpty'
import CircularProgress from '@/components/ui/CircularProgress'
import Reveal from '@/components/motion/Reveal'

export const metadata: Metadata = { title: 'Ma collection' }

export default async function CollectionPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/collection')

  const profile = await ensureProfile(supabase, user)
  const displayName = profileDisplayName(profile, user)

  const { data: completion } = await supabase
    .from('user_completion')
    .select('*')
    .eq('user_id', user.id)
    .order('completion_pct', { ascending: false })

  const { data: productCovers } = await supabase
    .from('products')
    .select('id, cover_image_url')

  const coverByProduct = new Map(
    (productCovers ?? []).map((p) => [p.id, p.cover_image_url])
  )

  const seriesWithCovers = (completion ?? []).map((s) => ({
    ...s,
    cover_image_url: s.product_id ? coverByProduct.get(s.product_id) ?? null : null,
  }))

  const { data: owned } = await supabase
    .from('user_collections')
    .select(`
      id, status, quantity, condition, updated_at,
      cards (
        id, card_number, player_name, image_url, variant_type, print_run,
        products ( id, name, season ),
        rarities ( name, level, color_hex ),
        teams ( name, short_name ),
        price_snapshots ( last_price, trend )
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'owned')
    .order('updated_at', { ascending: false })
    .limit(100)

  const totalValue = owned?.reduce((sum, uc) => {
    const snap = (uc.cards as { price_snapshots: { last_price: number | null } | null } | null)?.price_snapshots
    return sum + (snap?.last_price ?? 0) * (uc.quantity ?? 1)
  }, 0) ?? 0

  const totalOwned   = owned?.reduce((s, uc) => s + (uc.quantity ?? 1), 0) ?? 0
  const totalMissing = completion?.reduce((s, c) => s + (c.missing_count ?? 0), 0) ?? 0
  const seriesCount  = completion?.length ?? 0

  const globalTotal = completion?.reduce((s, c) => s + (c.total_cards ?? 0), 0) ?? 0
  const globalOwned = completion?.reduce((s, c) => s + (c.owned_count ?? 0), 0) ?? 0
  const globalPct   = globalTotal > 0 ? Math.round((globalOwned / globalTotal) * 100) : 0

  const hasContent = (owned?.length ?? 0) > 0 || (completion?.length ?? 0) > 0

  return (
    <main className="min-h-screen">
      <PageHeader
        title="Ma collection"
        subtitle={displayName}
        right={
          <Link href="/profil" className="shrink-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-panel border border-border/80 ring-2 ring-gold/10">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="" fill className="object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center text-sm font-semibold text-gold">
                  {displayName[0]?.toUpperCase()}
                </span>
              )}
            </div>
          </Link>
        }
      />

      <div className="page-container pt-8 md:pt-10 pb-10 space-y-10">
        {hasContent ? (
          <>
            <Reveal>
              <div className="glass-panel rounded-xl3 p-6 bg-hero-radial">
                <div className="flex items-center gap-5">
                  <CircularProgress value={globalPct} size={80} strokeWidth={5} />
                  <div className="flex-1 min-w-0">
                    <p className="text-2xs text-white/40 uppercase tracking-wider mb-1">Progression globale</p>
                    <p className="text-2xl font-bold text-gradient-gold">
                      {globalOwned} <span className="text-white/40 text-lg font-normal">/ {globalTotal}</span>
                    </p>
                    <p className="text-xs text-white/40 mt-1">cartes dans toutes tes séries</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <CollectionStats
                totalOwned={totalOwned}
                totalMissing={totalMissing}
                totalValue={totalValue}
                seriesCount={seriesCount}
              />
            </Reveal>

            {(completion?.length ?? 0) > 0 && (
              <Section title="Mes séries">
                <SeriesGrid series={seriesWithCovers} />
              </Section>
            )}

            {(owned?.length ?? 0) > 0 && (
              <Section title="Dernières cartes ajoutées">
                <CollectionByProduct items={owned ?? []} />
              </Section>
            )}
          </>
        ) : (
          <CollectionEmpty displayName={displayName} avatarUrl={profile?.avatar_url} />
        )}
      </div>
    </main>
  )
}
