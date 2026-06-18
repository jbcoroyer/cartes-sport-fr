export interface FootballDataTeam {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
  clubColors?: string
}

const BASE_URL = 'https://api.football-data.org/v4'

export async function searchTeams(query: string): Promise<FootballDataTeam[]> {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY
  if (!apiKey) return []

  const res = await fetch(`${BASE_URL}/teams?name=${encodeURIComponent(query)}`, {
    headers: { 'X-Auth-Token': apiKey },
    next: { revalidate: 86400 },
  })

  if (!res.ok) return []

  const data = await res.json()
  return (data.teams ?? []) as FootballDataTeam[]
}

export async function getTeamById(externalId: string): Promise<FootballDataTeam | null> {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY
  if (!apiKey) return null

  const res = await fetch(`${BASE_URL}/teams/${externalId}`, {
    headers: { 'X-Auth-Token': apiKey },
    next: { revalidate: 86400 },
  })

  if (!res.ok) return null
  return res.json() as Promise<FootballDataTeam>
}
