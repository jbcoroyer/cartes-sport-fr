import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/auth'
import { getDisplayCards } from '@/lib/collection'
import type { CollectionStatus } from '@/lib/types/database'

interface Props {
  params: Promise<{ setId: string }>
}

export async function GET(request: Request, { params }: Props) {
  const { setId } = await params
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get('teamId')
  const summary = searchParams.get('summary') === '1'

  const { supabase, user } = await getAuthUser()

  if (summary) {
    const { data: totals, error } = await supabase
      .from('product_club_totals')
      .select('team_id, total_cards')
      .eq('product_id', setId)
      .order('total_cards', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const teamIds = (totals ?? []).map((t) => t.team_id).filter(Boolean) as string[]
    const { data: teams } = teamIds.length
      ? await supabase.from('teams').select('id, name').in('id', teamIds)
      : { data: [] }

    const nameById = new Map((teams ?? []).map((t) => [t.id, t.name]))

    const summaryTeams = (totals ?? [])
      .filter((row) => row.team_id && row.total_cards)
      .map((row) => ({
        teamId: row.team_id!,
        teamName: nameById.get(row.team_id!) ?? 'Sans club',
        cardCount: row.total_cards ?? 0,
      }))

    return NextResponse.json(
      { teams: summaryTeams },
      { headers: { 'Cache-Control': 'private, max-age=60' } },
    )
  }

  let query = supabase
    .from('cards')
    .select(`
      id, card_number, player_name, position, card_type, variant_type,
      parent_card_id, product_id, team_id,
      teams ( name )
    `)
    .eq('product_id', setId)
    .order('card_number')

  if (teamId) query = query.eq('team_id', teamId)

  const { data: rawCards, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let collectionMap = new Map<string, { status: CollectionStatus; photoUrl: string | null }>()
  const displayCards = getDisplayCards(rawCards ?? [])
  const teamNameById = new Map(
    (rawCards ?? []).map((c) => [c.id, (c.teams as { name: string } | null)?.name ?? 'Sans club']),
  )
  const teamIdByCardId = new Map(
    (rawCards ?? []).map((c) => [c.id, c.team_id ?? '']),
  )

  if (user && displayCards.length) {
    const { data: collections } = await supabase
      .from('user_collections')
      .select('card_id, status, photo_url')
      .eq('user_id', user.id)
      .in('card_id', displayCards.map((c) => c.id))

    collectionMap = new Map(
      (collections ?? []).map((c) => [
        c.card_id,
        { status: c.status as CollectionStatus, photoUrl: c.photo_url },
      ]),
    )
  }

  const cards = displayCards.map((card) => ({
    id: card.id,
    cardNumber: card.card_number,
    playerName: card.player_name,
    position: card.position ?? null,
    teamName: teamNameById.get(card.id) ?? 'Sans club',
    teamId: teamIdByCardId.get(card.id) ?? teamId ?? '',
    variantType: card.variant_type,
    cardType: card.card_type,
    photoUrl: collectionMap.get(card.id)?.photoUrl ?? null,
    collectionStatus: collectionMap.get(card.id)?.status ?? null,
  }))

  return NextResponse.json(
    { cards },
    { headers: { 'Cache-Control': user ? 'private, no-store' : 'public, s-maxage=300' } },
  )
}
