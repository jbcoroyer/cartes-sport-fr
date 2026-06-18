import type { FootballDataTeam } from './client'
import { normalizeTeamName, TEAM_EXTERNAL_ID_OVERRIDES } from './normalize'

export function findApiTeam(
  dbTeamName: string,
  apiTeams: FootballDataTeam[],
): FootballDataTeam | null {
  const normalized = normalizeTeamName(dbTeamName)

  const overrideId = TEAM_EXTERNAL_ID_OVERRIDES[normalized]
  if (overrideId) {
    const direct = apiTeams.find((t) => t.id === overrideId)
    if (direct) return direct
  }

  // Correspondance exacte normalisée
  for (const team of apiTeams) {
    const candidates = [team.name, team.shortName, team.tla].filter(Boolean)
    for (const c of candidates) {
      if (normalizeTeamName(c) === normalized) return team
    }
  }

  // Inclusion mutuelle (ex: "liverpool fc" ↔ "liverpool")
  for (const team of apiTeams) {
    const apiNorm = normalizeTeamName(team.name)
    const shortNorm = normalizeTeamName(team.shortName)
    if (
      apiNorm.includes(normalized) ||
      normalized.includes(apiNorm) ||
      shortNorm.includes(normalized) ||
      normalized.includes(shortNorm)
    ) {
      if (normalized.length >= 4 && apiNorm.length >= 4) return team
    }
  }

  return null
}

export function parseClubColors(clubColors?: string | null): {
  primary: string | null
  secondary: string | null
} {
  if (!clubColors) return { primary: null, secondary: null }

  const COLOR_MAP: Record<string, string> = {
    red: '#C8102E',
    blue: '#004170',
    white: '#F5F5F5',
    black: '#1A1A1A',
    green: '#2D5A4A',
    yellow: '#F5B800',
    orange: '#E86100',
    navy: '#002654',
    maroon: '#6B2D3E',
    sky: '#6CABDD',
    claret: '#7B2D42',
  }

  const parts = clubColors.toLowerCase().split('/').map((s) => s.trim())
  const primary = COLOR_MAP[parts[0]?.split(' ')[0] ?? ''] ?? null
  const secondary = COLOR_MAP[parts[1]?.split(' ')[0] ?? ''] ?? null

  return { primary, secondary }
}
