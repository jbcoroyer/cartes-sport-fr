import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/auth'
import { getDisplayCards } from '@/lib/collection'
import type { CollectionStatus } from '@/lib/types/database'

interface Props {
  params: Promise<{ productId: string }>
}

export async function GET(_request: Request, { params }: Props) {
  const { productId } = await params
  const { supabase, user } = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const [{ data: rawCards }, { data: collections }] = await Promise.all([
    supabase
      .from('cards')
      .select('id, card_number, player_name, position, card_type, variant_type, parent_card_id, product_id')
      .eq('product_id', productId),
    supabase
      .from('user_collections')
      .select('card_id, status')
      .eq('user_id', user.id),
  ])

  const collectionMap = new Map(
    (collections ?? []).map((c) => [c.card_id, c.status as CollectionStatus]),
  )

  const cards = getDisplayCards(rawCards ?? [])
    .filter((c) => collectionMap.get(c.id) !== 'owned')
    .map((card) => ({
      id: card.id,
      cardNumber: card.card_number,
      playerName: card.player_name,
      position: card.position ?? null,
      variantType: card.variant_type,
      cardType: card.card_type,
      collectionStatus: collectionMap.get(card.id) ?? null,
      productId,
    }))

  return NextResponse.json({ cards })
}
