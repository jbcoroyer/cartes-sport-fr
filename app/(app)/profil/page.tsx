import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ensureProfile, profileDisplayName } from '@/lib/profile'
import ProfileEditor from '@/components/profile/ProfileEditor'
import SignOutButton from '@/components/profile/SignOutButton'
import ExhibitionWall from '@/components/profile/ExhibitionWall'
import AcquisitionTimeline from '@/components/profile/AcquisitionTimeline'
import RecentAcquisitions from '@/components/profile/RecentAcquisitions'
import BadgeMedal from '@/components/profile/BadgeMedal'
import Reveal from '@/components/motion/Reveal'
import { getUserSetProgress } from '@/lib/collection'
import { computeBadges } from '@/lib/badges'
import ClayProgressBar from '@/components/clay/ClayProgressBar'

export const metadata: Metadata = { title: "L'espace du curateur" }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/profil')

  const profile = await ensureProfile(supabase, user)
  if (!profile) redirect('/login?redirect=/profil')

  const progresses = await getUserSetProgress(supabase, user.id)
  const nearComplete = [...progresses]
    .sort((a, b) => b.pctBase - a.pctBase)
    .slice(0, 4)

  const { data: clubProgress } = await supabase
    .from('user_club_progress')
    .select('pct_owned')
    .eq('user_id', user.id)

  const clubHundred = (clubProgress ?? []).some((c) => (c.pct_owned ?? 0) >= 100)

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const { count: weekCount } = await supabase
    .from('acquisition_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('acquired_at', weekAgo.toISOString())

  const badges = computeBadges(progresses, clubHundred, weekCount ?? 0)

  const { data: showcase } = await supabase
    .from('user_showcase')
    .select('card_id, grid_position')
    .eq('user_id', user.id)

  const showcaseCardIds = (showcase ?? []).map((s) => s.card_id)
  const { data: showcaseCardDetails } = showcaseCardIds.length
    ? await supabase
        .from('cards')
        .select('id, card_number, player_name')
        .in('id', showcaseCardIds)
    : { data: [] }

  const showcaseCardMap = new Map(
    (showcaseCardDetails ?? []).map((c) => [c.id, c]),
  )

  const { data: ownedCollections } = await supabase
    .from('user_collections')
    .select('card_id')
    .eq('user_id', user.id)
    .eq('status', 'owned')
    .limit(50)

  const ownedIds = (ownedCollections ?? []).map((o) => o.card_id)
  const { data: ownedCardDetails } = ownedIds.length
    ? await supabase
        .from('cards')
        .select('id, card_number, player_name')
        .in('id', ownedIds)
    : { data: [] }

  const { data: events } = await supabase
    .from('acquisition_events')
    .select('id, acquired_at, source, notes, card_id')
    .eq('user_id', user.id)
    .order('acquired_at', { ascending: false })
    .limit(20)

  const eventCardIds = (events ?? []).map((e) => e.card_id)
  const { data: eventCardDetails } = eventCardIds.length
    ? await supabase
        .from('cards')
        .select('id, card_number, player_name, variant_type')
        .in('id', eventCardIds)
    : { data: [] }
  const eventCardMap = new Map((eventCardDetails ?? []).map((c) => [c.id, c]))

  const eventsWithCards = (events ?? []).map((e) => ({
    ...e,
    cards: eventCardMap.get(e.card_id) ?? null,
  }))

  const { data: recentEvents } = await supabase
    .from('acquisition_events')
    .select('id, acquired_at, card_id')
    .eq('user_id', user.id)
    .order('acquired_at', { ascending: false })
    .limit(8)

  const recentCardIds = (recentEvents ?? []).map((e) => e.card_id)
  const { data: recentCardDetails } = recentCardIds.length
    ? await supabase
        .from('cards')
        .select('id, card_number, player_name')
        .in('id', recentCardIds)
    : { data: [] }
  const recentCardMap = new Map((recentCardDetails ?? []).map((c) => [c.id, c]))

  const displayName = profileDisplayName(profile, user)

  return (
    <main className="min-h-screen bg-museum">
      <div className="page-container py-10 md:py-14 space-y-12">
        <Reveal>
          <header>
            <h1 className="font-serif text-display-sm font-medium">L&apos;espace du curateur</h1>
            <p className="text-muted mt-2 font-sans">{displayName}</p>
          </header>
        </Reveal>

        <Reveal delay={0.05}>
          <ExhibitionWall
            userId={user.id}
            cards={(showcase ?? []).map((s) => {
              const card = showcaseCardMap.get(s.card_id)
              return {
                cardId: s.card_id,
                gridPosition: s.grid_position,
                cardNumber: card?.card_number ?? '',
                playerName: card?.player_name ?? '',
              }
            })}
            ownedCards={(ownedCardDetails ?? []).map((card) => ({
              id: card.id,
              cardNumber: card.card_number,
              playerName: card.player_name,
            }))}
          />
        </Reveal>

        <Reveal delay={0.08}>
          <section>
            <h2 className="font-serif text-xl mb-4">Sets en cours</h2>
            <div className="space-y-4">
              {nearComplete.map((p) => (
                <Link key={p.productId} href={`/album/${p.productId}`} className="block clay-card p-4">
                  <p className="font-serif text-sm mb-2">{p.productName}</p>
                  <ClayProgressBar
                    value={p.baseOwned}
                    max={p.baseTotal || 1}
                    color="#2D5A4A"
                    label={`Base ${p.baseOwned}/${p.baseTotal}`}
                  />
                </Link>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.1}>
          <section>
            <h2 className="font-serif text-xl mb-4">Dernières acquisitions</h2>
            <RecentAcquisitions
              stories={(recentEvents ?? []).map((e) => {
                const card = recentCardMap.get(e.card_id)
                return {
                  id: e.id,
                  cardId: e.card_id,
                  cardNumber: card?.card_number ?? '',
                  playerName: card?.player_name ?? '',
                  acquiredAt: e.acquired_at,
                }
              })}
            />
          </section>
        </Reveal>

        <Reveal delay={0.12}>
          <section>
            <h2 className="font-serif text-xl mb-4">Journal d&apos;acquisition</h2>
            <AcquisitionTimeline events={eventsWithCards} />
          </section>
        </Reveal>

        <Reveal delay={0.14}>
          <section>
            <h2 className="font-serif text-xl mb-4">Distinctions</h2>
            <BadgeMedal badges={badges} />
          </section>
        </Reveal>

        <Reveal delay={0.16}>
          <section className="clay-card p-5">
            <ProfileEditor profile={profile} email={user.email ?? ''} />
          </section>
        </Reveal>

        <div className="flex flex-wrap gap-4 justify-center font-sans text-sm">
          <Link href="/profil/ombres" className="text-muted hover:text-ink">
            Mur des Ombres
          </Link>
          <Link href="/profil/parametres" className="text-muted hover:text-ink">
            Paramètres
          </Link>
        </div>

        <section className="text-center pt-4">
          <SignOutButton />
        </section>
      </div>
    </main>
  )
}
