import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const env = Object.fromEntries(
  readFileSync(resolve(root, '.env.local'), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    }),
)

const ref = 'tfmaekihhqnouzdtuion'
const pwd = env.SUPABASE_DB_PASSWORD
const sql = readFileSync(
  resolve(root, 'supabase/migrations/20250617000000_fix_auth_user_profile_trigger.sql'),
  'utf8',
)

const { default: pg } = await import('pg')

const client = new pg.Client({
  host: 'aws-0-eu-west-1.pooler.supabase.com',
  port: 6543,
  user: `postgres.${ref}`,
  password: pwd,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
})

try {
  await client.connect()
  await client.query(sql)
  console.log('Migration OK')
} catch (e) {
  console.error('Migration FAIL:', e.message)
  process.exit(1)
} finally {
  await client.end()
}
