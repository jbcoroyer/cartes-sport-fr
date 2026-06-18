import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: rows } = await supabase
    .from('user_collections')
    .select('status, quantity, condition, acquired_at, acquisition_source, notes, card_id')
    .eq('user_id', user.id)
    .eq('status', 'owned')

  const cardIds = (rows ?? []).map((r) => r.card_id)
  const { data: cards } = cardIds.length
    ? await supabase
        .from('cards')
        .select('id, card_number, player_name, position, variant_type, card_type, product_id, team_id')
        .in('id', cardIds)
    : { data: [] }

  const productIds = [...new Set((cards ?? []).map((c) => c.product_id))]
  const teamIds = [...new Set((cards ?? []).map((c) => c.team_id).filter(Boolean))]

  const { data: products } = productIds.length
    ? await supabase.from('products').select('id, name, season').in('id', productIds)
    : { data: [] }

  const { data: teams } = teamIds.length
    ? await supabase.from('teams').select('id, name').in('id', teamIds as string[])
    : { data: [] }

  const cardMap = new Map((cards ?? []).map((c) => [c.id, c]))
  const productMap = new Map((products ?? []).map((p) => [p.id, p]))
  const teamMap = new Map((teams ?? []).map((t) => [t.id, t]))

  const header = [
    'card_number',
    'player_name',
    'position',
    'variant',
    'card_type',
    'team',
    'product',
    'season',
    'condition',
    'quantity',
    'acquired_at',
    'source',
    'notes',
  ].join(',')

  const lines = (rows ?? []).map((row) => {
    const card = cardMap.get(row.card_id)
    const product = card ? productMap.get(card.product_id) : null
    const team = card?.team_id ? teamMap.get(card.team_id) : null

    const values = [
      card?.card_number,
      card?.player_name,
      card?.position,
      card?.variant_type,
      card?.card_type,
      team?.name,
      product?.name,
      product?.season,
      row.condition,
      row.quantity,
      row.acquired_at,
      row.acquisition_source,
      row.notes,
    ].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)

    return values.join(',')
  })

  const csv = [header, ...lines].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="collection.csv"',
    },
  })
}
