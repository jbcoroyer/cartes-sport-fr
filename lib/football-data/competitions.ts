import type { FootballDataTeam } from './client'

const BASE_URL = 'https://api.football-data.org/v4'

/** Compétitions couvrant nos sets UEFA + Ligue 1 */
export const SYNC_COMPETITION_CODES = [
  'CL',   // Champions League
  'EL',   // Europa League
  'EC',   // Conference League (code EC on v4)
  'FL1',  // Ligue 1
  'FL2',  // Ligue 2 (clubs relégués)
  'PL',   // Premier League
  'PD',   // La Liga
  'BL1',  // Bundesliga
  'SA',   // Serie A
  'PPL',  // Primeira Liga
  'DED',  // Eredivisie
  'SC1',  // Scottish Premiership
] as const

export async function fetchCompetitionTeams(
  code: string,
  apiKey: string,
): Promise<FootballDataTeam[]> {
  const res = await fetch(`${BASE_URL}/competitions/${code}/teams`, {
    headers: { 'X-Auth-Token': apiKey },
  })

  if (!res.ok) {
    console.warn(`  ⚠ Compétition ${code}: HTTP ${res.status}`)
    return []
  }

  const data = await res.json()
  return (data.teams ?? []) as FootballDataTeam[]
}

export async function fetchAllCompetitionTeams(apiKey: string): Promise<FootballDataTeam[]> {
  const byId = new Map<number, FootballDataTeam>()

  for (const code of SYNC_COMPETITION_CODES) {
    const teams = await fetchCompetitionTeams(code, apiKey)
    for (const team of teams) {
      byId.set(team.id, team)
    }
    // Respecter le quota gratuit (~10 req/min)
    await new Promise((r) => setTimeout(r, 6500))
  }

  return Array.from(byId.values())
}
