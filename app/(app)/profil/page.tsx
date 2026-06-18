import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getAuthUserWithProfile } from '@/lib/supabase/auth'
import { profileDisplayName } from '@/lib/profile'
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
import Link from 'next/link'

export const metadata: Metadata = { title: "L'espace du curateur" }

export default async function ProfilePage() {
  const session = await getAuthUserWithProfile()
  if (!session?.user || !session.profile) redirect('/login?redirect=/profil')

  const { supabase, user, profile } = session

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const [
    progresses,
    clubProgressRes,
    weekCountRes,
    showcaseRes,
    ownedCollectionsRes,
    eventsRes,
  ] = await Promise.all([
    getUserSetProgress(supabase, user.id),
    supabase.from('user_club_progress').select('pct_owned').eq('user_id', user.id),
    supabase
      .from('acquisition_events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('acquired_at', weekAgo.toISOString()),
    supabase.from('user_showcase').select('card_id, grid_position').eq('user_id', user.id),
    supabase
      .from('user_collections')
      .select('card_id, photo_url')
      .eq('user_id', user.id)
      .eq('status', 'owned')
      .limit(50),
    supabase
      .from('acquisition_events')
      .select('id, acquired_at, source, notes, card_id')
      .eq('user_id', user.id)
      .order('acquired_at', { ascending: false })
      .limit(20),
  ])

  const eventCardIds = (eventsRes.data ?? []).map((e) => e.card_id)
  const { data: eventCardDetails } = eventCardIds.length
    ? await supabase
        .from('cards')
        .select('id, card_number, player_name, variant_type')
        .in('id', eventCardIds)
    : { data: [] }
  const eventCardMap = new Map((eventCardDetails ?? []).map((c) => [c.id, c]))

  const eventsWithCards = (eventsRes.data ?? []).map((e) => ({
    ...e,
    cards: eventCardMap.get(e.card_id) ?? null,
  }))

  const nearComplete = [...progresses].sort((a, b) => b.pctBase - a.pctBase).slice(0, 4)
  const clubHundred = (clubProgressRes.data ?? []).some((c) => (c.pct_owned ?? 0) >= 100)
  const badges = computeBadges(progresses, clubHundred, weekCountRes.count ?? 0)

  const showcaseCardIds = (showcaseRes.data ?? []).map((s) => s.card_id)
  const ownedIds = (ownedCollectionsRes.data ?? []).map((o) => o.card_id)
  const allCardIds = [...new Set([...showcaseCardIds, ...ownedIds])]

  const { data: cardDetails } = allCardIds.length
    ? await supabase
        .from('cards')
        .select('id, card_number, player_name')
        .in('id', allCardIds)
    : { data: [] }

  const cardMap = new Map((cardDetails ?? []).map((c) => [c.id, c]))
  const photoByCardId = new Map(
    (ownedCollectionsRes.data ?? []).map((o) => [o.card_id, o.photo_url]),
  )
  const recentEvents = eventsWithCards.slice(0, 8)
  const displayName = profileDisplayName(profile, user)

  return (
    <main className="min-h-screen bg-museum">
      <div className="page-container py-10 md:py-14 space-y-12">
        <Reveal>
          <header>
            <h1 className="type-hero text-display-sm">L&apos;espace du curateur</h1>
            <p className="type-body text-muted mt-2">{displayName}</p>
          </header>
        </Reveal>

        <Reveal delay={0.05}>
          <ExhibitionWall
            userId={user.id}
            cards={(showcaseRes.data ?? []).map((s) => {
              const card = cardMap.get(s.card_id)
              return {
                cardId: s.card_id,
                gridPosition: s.grid_position,
                cardNumber: card?.card_number ?? '',
                playerName: card?.player_name ?? '',
                photoUrl: photoByCardId.get(s.card_id) ?? null,
              }
            })}
            ownedCards={(ownedIds
              .map((id) => cardMap.get(id))
              .filter(Boolean) as { id: string; card_number: string; player_name: string }[])
              .map((card) => ({
                id: card.id,
                cardNumber: card.card_number,
                playerName: card.player_name,
                photoUrl: photoByCardId.get(card.id) ?? null,
              }))}
          />
        </Reveal>

        <Reveal delay={0.08}>
          <section>
            <h2 className="type-title text-xl mb-4">Sets en cours</h2>
            <div className="space-y-4">
              {nearComplete.map((p) => (
                <Link key={p.productId} href={`/album/${p.productId}`} className="block clay-card p-4">
                  <p className="type-subtitle text-sm mb-2">{p.productName}</p>
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
            <h2 className="type-title text-xl mb-4">Dernières acquisitions</h2>
            <RecentAcquisitions
              stories={recentEvents.map((e) => ({
                id: e.id,
                cardId: e.card_id,
                cardNumber: e.cards?.card_number ?? '',
                playerName: e.cards?.player_name ?? '',
                acquiredAt: e.acquired_at,
              }))}
            />
          </section>
        </Reveal>

        <Reveal delay={0.12}>
          <section>
            <h2 className="type-title text-xl mb-4">Journal d&apos;acquisition</h2>
            <AcquisitionTimeline events={eventsWithCards} />
          </section>
        </Reveal>

        <Reveal delay={0.14}>
          <section>
            <h2 className="type-title text-xl mb-4">Distinctions</h2>
            <BadgeMedal badges={badges} />
          </section>
        </Reveal>

        <Reveal delay={0.16}>
          <section className="clay-card p-5">
            <ProfileEditor profile={profile} email={user.email ?? ''} />
          </section>
        </Reveal>

        <div className="flex flex-wrap gap-4 justify-center type-body text-sm">
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
