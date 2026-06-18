import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, UserSetProgress } from '@/lib/types/database'
import { resolveTeamCrestUrl } from '@/lib/football-data/crest-overrides'

export type SetProgress = {
  productId: string
  productName: string
  season: string
  baseOwned: number
  baseTotal: number
  masterOwned: number
  masterTotal: number
  pctBase: number
  pctMaster: number
  lastAcquiredAt: string | null
}

export function emptyProgress(
  productId: string,
  productName: string,
  season: string,
  baseTotal = 0,
  masterTotal = 0,
): SetProgress {
  return {
    productId,
    productName,
    season,
    baseOwned: 0,
    baseTotal,
    masterOwned: 0,
    masterTotal,
    pctBase: 0,
    pctMaster: 0,
    lastAcquiredAt: null,
  }
}

export function mapSetProgress(row: UserSetProgress): SetProgress {
  return {
    productId: row.product_id!,
    productName: row.product_name ?? '',
    season: row.season ?? '',
    baseOwned: row.base_owned ?? 0,
    baseTotal: row.base_total ?? 0,
    masterOwned: row.master_owned ?? 0,
    masterTotal: row.master_total ?? 0,
    pctBase: row.pct_base ?? 0,
    pctMaster: row.pct_master ?? 0,
    lastAcquiredAt: row.last_acquired_at,
  }
}

export async function getUserSetProgress(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<SetProgress[]> {
  const { data } = await supabase
    .from('user_set_progress')
    .select('*')
    .eq('user_id', userId)

  return (data ?? []).map(mapSetProgress)
}

export async function getSetProgressForProduct(
  supabase: SupabaseClient<Database>,
  userId: string | null,
  productId: string,
): Promise<SetProgress | null> {
  if (!userId) return null

  const { data } = await supabase
    .from('user_set_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle()

  return data ? mapSetProgress(data) : null
}

export type ClubProgressItem = {
  teamId: string
  teamName: string
  shortName: string | null
  crestUrl: string | null
  colorPrimary: string | null
  colorSecondary: string | null
  ownedCards: number
  totalCards: number
  pctOwned: number
  sortOrder: number
  groupPhase: string | null
}

export async function getClubProgressForSet(
  supabase: SupabaseClient<Database>,
  userId: string | null,
  productId: string,
): Promise<ClubProgressItem[]> {
  const { data: productTeams } = await supabase
    .from('product_teams')
    .select('team_id, sort_order, group_phase')
    .eq('product_id', productId)
    .order('sort_order')

  const teamIds = (productTeams ?? []).map((pt) => pt.team_id)
  if (teamIds.length === 0) {
    const { data: totals } = await supabase
      .from('product_club_totals')
      .select('team_id, total_cards')
      .eq('product_id', productId)

    const fallbackTeamIds = (totals ?? []).map((t) => t.team_id!).filter(Boolean)
    if (fallbackTeamIds.length === 0) return []

    const { data: teams } = await supabase
      .from('teams')
      .select('id, name, short_name, crest_cached_url, logo_url, color_primary, color_secondary')
      .in('id', fallbackTeamIds)

    return (teams ?? []).map((team, i) => ({
      teamId: team.id,
      teamName: team.name,
      shortName: team.short_name,
      crestUrl: resolveTeamCrestUrl(team.name, team.crest_cached_url ?? team.logo_url),
      colorPrimary: team.color_primary,
      colorSecondary: team.color_secondary,
      ownedCards: 0,
      totalCards: totals?.find((t) => t.team_id === team.id)?.total_cards ?? 0,
      pctOwned: 0,
      sortOrder: i,
      groupPhase: null,
    }))
  }

  const orderMap = new Map((productTeams ?? []).map((o) => [o.team_id, o]))

  const teamsQuery = supabase
    .from('teams')
    .select('id, name, short_name, crest_cached_url, logo_url, color_primary, color_secondary')
    .in('id', teamIds)

  const totalsQuery = supabase
    .from('product_club_totals')
    .select('team_id, total_cards')
    .eq('product_id', productId)

  const progressQuery = userId
    ? supabase
        .from('user_club_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
    : Promise.resolve({ data: [] as { team_id: string | null; owned_cards: number | null; total_cards: number | null; pct_owned: number | null }[] })

  const [{ data: teams }, { data: totals }, { data: progress }] = await Promise.all([
    teamsQuery,
    totalsQuery,
    progressQuery,
  ])

  const teamMap = new Map((teams ?? []).map((t) => [t.id, t]))
  const progressMap = new Map((progress ?? []).map((p) => [p.team_id!, p]))
  const totalsMap = new Map((totals ?? []).map((t) => [t.team_id!, t.total_cards ?? 0]))

  return teamIds
    .map((teamId) => {
      const team = teamMap.get(teamId)
      const prog = progressMap.get(teamId)
      const order = orderMap.get(teamId)
      if (!team) return null
      const totalCards = userId
        ? (prog?.total_cards ?? totalsMap.get(teamId) ?? 0)
        : (totalsMap.get(teamId) ?? 0)
      return {
        teamId: team.id,
        teamName: team.name,
        shortName: team.short_name,
        crestUrl: resolveTeamCrestUrl(team.name, team.crest_cached_url ?? team.logo_url),
        colorPrimary: team.color_primary,
        colorSecondary: team.color_secondary,
        ownedCards: prog?.owned_cards ?? 0,
        totalCards,
        pctOwned: prog?.pct_owned ?? 0,
        sortOrder: order?.sort_order ?? 999,
        groupPhase: order?.group_phase ?? null,
      }
    })
    .filter(Boolean) as ClubProgressItem[]
}
