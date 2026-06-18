import { NextResponse } from 'next/server'
import { searchTeams } from '@/lib/football-data/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ teams: [] })
  }

  const teams = await searchTeams(q)
  return NextResponse.json({
    teams: teams.map((t) => ({
      id: t.id,
      name: t.name,
      shortName: t.shortName,
      crest: t.crest,
    })),
  })
}
