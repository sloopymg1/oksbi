import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import pg from 'pg'

const { Pool } = pg

try {
  const settings = JSON.parse(await readFile(resolve('local.settings.json'), 'utf8'))
  for (const [name, value] of Object.entries(settings.Values ?? {})) {
    if (!process.env[name] && typeof value === 'string') {
      process.env[name] = value
    }
  }
} catch {
  // Environment variables remain the source of truth outside local development.
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is required')
}

const pool = new Pool({ connectionString })
const client = await pool.connect()

try {
  await client.query('BEGIN')
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `)

  const migrationId = '0001_initial'
  const applied = await client.query('SELECT id FROM schema_migrations WHERE id = $1', [migrationId])
  if (applied.rowCount === 0) {
    const migration = await readFile(resolve('prisma/migrations/0001_initial/migration.sql'), 'utf8')
    await client.query(migration)
    await client.query('INSERT INTO schema_migrations (id) VALUES ($1)', [migrationId])
    console.log(`Applied ${migrationId}`)
  } else {
    console.log(`Already applied ${migrationId}`)
  }

  await client.query('COMMIT')
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally {
  client.release()
  await pool.end()
}
