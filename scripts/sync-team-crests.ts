/**
 * Synchronise les blasons de tous les clubs depuis Football-Data.org
 *
 * Lancer : npx tsx scripts/sync-team-crests.ts
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { syncAllTeamsFromCompetitions } from '../lib/football-data/sync-team'

const envPath = resolve(process.cwd(), '.env.local')
const env = readFileSync(envPath, 'utf-8')
for (const line of env.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eq = trimmed.indexOf('=')
  if (eq === -1) continue
  const key = trimmed.slice(0, eq)
  const val = trimmed.slice(eq + 1)
  if (!process.env[key]) process.env[key] = val
}

async function main() {
  console.log('🏟️  Sync blasons clubs\n')
  const result = await syncAllTeamsFromCompetitions()
  console.log(`\n✅ Terminé: ${result.synced} synchronisés, ${result.skipped} déjà en cache, ${result.failed.length} échecs / ${result.total} clubs`)

  if (result.failed.length > 0) {
    console.log('\nClubs non matchés:')
    for (const name of result.failed) console.log(`  - ${name}`)
  }
}

main().catch((err) => {
  console.error('❌', err)
  process.exit(1)
})
