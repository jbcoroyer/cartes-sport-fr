import { readFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    }),
)

const ref = 'tfmaekihhqnouzdtuion'
const pwd = env.SUPABASE_DB_PASSWORD
const { default: pg } = await import('pg')

const regions = ['eu-west-1', 'eu-central-1', 'eu-west-2', 'eu-west-3', 'eu-north-1', 'us-east-1', 'ap-southeast-1']
const hosts = []

for (const region of regions) {
  for (const prefix of ['aws-0', 'aws-1']) {
    hosts.push(`postgresql://postgres.${ref}:${encodeURIComponent(pwd)}@${prefix}-${region}.pooler.supabase.com:6543/postgres`)
    hosts.push(`postgresql://postgres.${ref}:${encodeURIComponent(pwd)}@${prefix}-${region}.pooler.supabase.com:5432/postgres`)
  }
}

for (const cs of hosts) {
  const host = cs.split('@')[1]
  const client = new pg.Client({ connectionString: cs, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 5000 })
  try {
    await client.connect()
    await client.query('select 1')
    await client.end()
    console.log('OK', host)
    process.exit(0)
  } catch (e) {
    const msg = e.message
    if (!msg.includes('ENOTFOUND') && !msg.includes('tenant/user')) {
      console.log('AUTH_FAIL', host, msg)
    }
    try {
      await client.end()
    } catch {
      /* ignore */
    }
  }
}

console.log('NO_HOST')
process.exit(1)
