import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncTeamByExternalId, syncTeamByName } from '@/lib/football-data/sync-team'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: teamId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: team } = await supabase
    .from('teams')
    .select('id, name, external_id')
    .eq('id', teamId)
    .single()

  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 })
  }

  const result = team.external_id
    ? await syncTeamByExternalId(team.id, team.external_id)
    : await syncTeamByName(team.id, team.name)

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 })
  }

  return NextResponse.json({ ok: true, crestUrl: result.crestUrl })
}
