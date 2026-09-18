import { readFile, readdir } from 'node:fs/promises'
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

  const migrations = (await readdir(resolve('prisma/migrations'))).sort()
  for (const migrationId of migrations) {
    const applied = await client.query('SELECT id FROM schema_migrations WHERE id = $1', [migrationId])
    if (applied.rowCount === 0) {
      const migration = await readFile(resolve('prisma/migrations', migrationId, 'migration.sql'), 'utf8')
      await client.query(migration)
      await client.query('INSERT INTO schema_migrations (id) VALUES ($1)', [migrationId])
      console.log(`Applied ${migrationId}`)
    }
  }

  await client.query('COMMIT')
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally {
  client.release()
  await pool.end()
}
