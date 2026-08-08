/**
 * PostgreSQL database configuration.
 *
 * The repository is the only application layer that talks to this pool.
 * DATABASE_URL is loaded from the environment so credentials are never hardcoded.
 */

const { Pool } = require('pg')

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required')
}

const pool = new Pool({
  connectionString: databaseUrl,
})

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err)
})

module.exports = { pool }
