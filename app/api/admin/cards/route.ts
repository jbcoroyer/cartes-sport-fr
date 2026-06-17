import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface CreateCardBody {
  product_id: string
  card_number: string
  player_name: string
  team_name: string
  rarity_name: string
  position?: string
  variant_type?: string
  print_run?: number | null
  is_autograph?: boolean
  is_rookie?: boolean
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await request.json() as CreateCardBody

  if (!body.product_id || !body.card_number || !body.player_name || !body.team_name || !body.rarity_name) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  try {
    let { data: team } = await supabase
      .from('teams')
      .select('id')
      .eq('name', body.team_name)
      .single()

    if (!team) {
      const { data: newTeam, error: teamErr } = await supabase
        .from('teams')
        .insert({ name: body.team_name })
        .select('id')
        .single()
      if (teamErr) throw teamErr
      team = newTeam
    }

    let { data: rarity } = await supabase
      .from('rarities')
      .select('id')
      .eq('product_id', body.product_id)
      .eq('name', body.rarity_name)
      .single()

    if (!rarity) {
      const { data: newRarity, error: rarityErr } = await supabase
        .from('rarities')
        .insert({ product_id: body.product_id, name: body.rarity_name })
        .select('id')
        .single()
      if (rarityErr) throw rarityErr
      rarity = newRarity
    }

    const { data: card, error: cardErr } = await supabase
      .from('cards')
      .insert({
        product_id: body.product_id,
        team_id: team!.id,
        rarity_id: rarity!.id,
        card_number: body.card_number,
        player_name: body.player_name,
        position: body.position ?? null,
        variant_type: body.variant_type ?? 'numbered',
        print_run: body.print_run ?? null,
        is_autograph: body.is_autograph ?? false,
        is_rookie: body.is_rookie ?? false,
      })
      .select('id')
      .single()

    if (cardErr) {
      if (cardErr.code === '23505') {
        return NextResponse.json(
          { error: 'Une carte avec ce numéro, ce variant et ce tirage existe déjà pour ce produit.' },
          { status: 409 }
        )
      }
      throw cardErr
    }

    return NextResponse.json({ success: true, card_id: card.id })

  } catch (err) {
    console.error('Erreur création carte:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
