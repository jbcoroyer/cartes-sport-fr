import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'
import { getTeamById, searchTeams } from './client'
import type { FootballDataTeam } from './client'
import { fetchAllCompetitionTeams } from './competitions'
import { findApiTeam, parseClubColors } from './match-team'
import { normalizeTeamName, TEAM_EXTERNAL_ID_OVERRIDES } from './normalize'
import { TEAM_CREST_URL_OVERRIDES } from './crest-overrides'

function getServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

async function downloadCrest(crestUrl: string): Promise<Buffer | null> {
  try {
    const res = await fetch(crestUrl)
    if (!res.ok) return null
    return Buffer.from(await res.arrayBuffer())
  } catch {
    return null
  }
}

export async function syncTeamFromApiTeam(
  teamId: string,
  apiTeam: { id: number; name: string; shortName: string; tla: string; crest: string; clubColors?: string },
  options: { uploadToStorage?: boolean } = {},
) {
  const { uploadToStorage = false } = options
  const supabase = getServiceClient()
  const colors = parseClubColors(apiTeam.clubColors ?? null)

  let crestUrl = apiTeam.crest

  if (uploadToStorage && apiTeam.crest) {
    const buffer = await downloadCrest(apiTeam.crest)
    if (buffer) {
      const path = `${teamId}.png`
      const { error: uploadError } = await supabase.storage
        .from('team-crests')
        .upload(path, buffer, { contentType: 'image/png', upsert: true })

      if (!uploadError) {
        const { data: publicUrl } = supabase.storage.from('team-crests').getPublicUrl(path)
        crestUrl = publicUrl.publicUrl
      }
    }
  }

  const { error: updateError } = await supabase
    .from('teams')
    .update({
      ...(apiTeam.id > 0 ? { external_id: String(apiTeam.id) } : {}),
      name: apiTeam.name,
      short_name: apiTeam.shortName || apiTeam.tla,
      crest_cached_url: crestUrl,
      logo_url: crestUrl,
      color_primary: colors.primary,
      color_secondary: colors.secondary,
    })
    .eq('id', teamId)

  if (updateError) return { ok: false as const, error: updateError.message }
  return { ok: true as const, crestUrl }
}

export async function syncTeamByExternalId(teamId: string, externalId: string) {
  const apiTeam = await getTeamById(externalId)
  if (!apiTeam?.crest) return { ok: false as const, error: 'Team not found' }
  return syncTeamFromApiTeam(teamId, { ...apiTeam, clubColors: undefined })
}

export async function syncTeamByName(teamId: string, name: string) {
  const results = await searchTeams(name)
  const apiTeam = results.find((t) =>
    t.name.toLowerCase().includes(name.toLowerCase().slice(0, 6)),
  ) ?? results[0]
  if (!apiTeam) return { ok: false as const, error: 'No match' }
  return syncTeamFromApiTeam(teamId, { ...apiTeam, clubColors: undefined })
}

async function resolveApiTeam(
  dbTeamName: string,
  apiTeams: FootballDataTeam[],
): Promise<FootballDataTeam | null> {
  const match = findApiTeam(dbTeamName, apiTeams)
  if (match?.crest) return match

  const normalized = normalizeTeamName(dbTeamName)
  const overrideId = TEAM_EXTERNAL_ID_OVERRIDES[normalized]
  if (overrideId) {
    await new Promise((r) => setTimeout(r, 6500))
    const direct = await getTeamById(String(overrideId))
    if (direct?.crest) return direct

    return {
      id: overrideId,
      name: dbTeamName,
      shortName: dbTeamName,
      tla: '',
      crest: `https://crests.football-data.org/${overrideId}.png`,
    }
  }

  const crestOverride = TEAM_CREST_URL_OVERRIDES[normalized]
  if (crestOverride) {
    return {
      id: 0,
      name: dbTeamName,
      shortName: dbTeamName,
      tla: '',
      crest: crestOverride,
    }
  }

  return null
}

export async function syncAllTeamsFromCompetitions() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY
  if (!apiKey) throw new Error('FOOTBALL_DATA_API_KEY manquant')

  const supabase = getServiceClient()
  const { data: dbTeams, error } = await supabase.from('teams').select('id, name, crest_cached_url')
  if (error) throw new Error(error.message)

  console.log('📡 Téléchargement des clubs depuis Football-Data.org…')
  const apiTeams = await fetchAllCompetitionTeams(apiKey)
  console.log(`   ${apiTeams.length} clubs API chargés`)

  let synced = 0
  let skipped = 0
  let failed: string[] = []

  for (const team of dbTeams ?? []) {
    if (team.crest_cached_url) {
      skipped++
      continue
    }

    const crestOverride = TEAM_CREST_URL_OVERRIDES[normalizeTeamName(team.name)]
    if (crestOverride) {
      const result = await syncTeamFromApiTeam(team.id, {
        id: 0,
        name: team.name,
        shortName: team.name,
        tla: '',
        crest: crestOverride,
      })
      if (result.ok) {
        synced++
        console.log(`   ✓ ${team.name} (blason à jour)`)
      } else {
        failed.push(team.name)
      }
      continue
    }

    const match = await resolveApiTeam(team.name, apiTeams)
    if (!match?.crest) {
      failed.push(team.name)
      continue
    }

    const result = await syncTeamFromApiTeam(team.id, match)

    if (result.ok) {
      synced++
      console.log(`   ✓ ${team.name}`)
    } else {
      failed.push(team.name)
      console.log(`   ✗ ${team.name}: ${result.error}`)
    }
  }

  return { synced, skipped, failed, total: dbTeams?.length ?? 0 }
}

export function getTeamCrestUrl(team: {
  name?: string
  crest_cached_url?: string | null
  logo_url?: string | null
}): string | null {
  if (team.name) {
    const override = TEAM_CREST_URL_OVERRIDES[normalizeTeamName(team.name)]
    if (override) return override
  }
  return team.crest_cached_url ?? team.logo_url ?? null
}
