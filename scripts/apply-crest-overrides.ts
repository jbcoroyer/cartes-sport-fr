/**
 * Applique les blasons curatés (FotMob) à tous les clubs en base.
 * Lancer : npx tsx scripts/apply-crest-overrides.ts
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'
import { normalizeTeamName } from '@/lib/football-data/normalize'
import { TEAM_CREST_URL_OVERRIDES } from '@/lib/football-data/crest-overrides'

const envPath = resolve(process.cwd(), '.env.local')
const env = readFileSync(envPath, 'utf-8')
for (const line of env.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eq = trimmed.indexOf('=')
  if (eq === -1) continue
  const key = trimmed.slice(0, eq)
  const value = trimmed.slice(eq + 1)
  if (!process.env[key]) process.env[key] = value
}

async function main() {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data: teams, error } = await supabase.from('teams').select('id, name, crest_cached_url')
  if (error) throw error

  let updated = 0
  let skipped = 0

  for (const team of teams ?? []) {
    const crest = TEAM_CREST_URL_OVERRIDES[normalizeTeamName(team.name)]
    if (!crest) {
      skipped++
      continue
    }
    if (team.crest_cached_url === crest) {
      skipped++
      continue
    }

    const { error: updateError } = await supabase
      .from('teams')
      .update({ crest_cached_url: crest, logo_url: crest })
      .eq('id', team.id)

    if (updateError) {
      console.error(`✗ ${team.name}: ${updateError.message}`)
    } else {
      updated++
      console.log(`✓ ${team.name}`)
    }
  }

  console.log(`\nTerminé: ${updated} mis à jour, ${skipped} inchangés / ${teams?.length ?? 0} clubs`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
