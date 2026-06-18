import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDisplayCards } from '@/lib/collection'
import type { CollectionStatus } from '@/lib/types/database'

interface Props {
  params: Promise<{ setId: string }>
}

export async function GET(_request: Request, { params }: Props) {
  const { setId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: rawCards, error } = await supabase
    .from('cards')
    .select(`
      id, card_number, player_name, position, card_type, variant_type,
      parent_card_id, product_id,
      teams ( name )
    `)
    .eq('product_id', setId)
    .order('card_number')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let collectionMap = new Map<string, CollectionStatus>()
  if (user && rawCards?.length) {
    const { data: collections } = await supabase
      .from('user_collections')
      .select('card_id, status')
      .eq('user_id', user.id)
      .in('card_id', rawCards.map((c) => c.id))

    collectionMap = new Map(
      (collections ?? []).map((c) => [c.card_id, c.status as CollectionStatus]),
    )
  }

  const teamByCardId = new Map(
    (rawCards ?? []).map((card) => [card.id, (card.teams as { name: string } | null)?.name ?? 'Sans club']),
  )

  const displayCards = getDisplayCards(rawCards ?? [])
  const cards = displayCards.map((card) => ({
    id: card.id,
    cardNumber: card.card_number,
    playerName: card.player_name,
    position: card.position ?? null,
    teamName: teamByCardId.get(card.id) ?? 'Sans club',
    collectionStatus: collectionMap.get(card.id) ?? null,
  }))

  return NextResponse.json({ cards })
}
