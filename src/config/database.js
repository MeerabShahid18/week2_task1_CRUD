/**
 * Database configuration & initialization
 * ----------------------------------------
 * Owns the single SQLite connection for the whole app and guarantees the
 * schema + seed data exist before any query runs.
 *
 * Why better-sqlite3?
 *   - Synchronous, fast, and requires no separate DB server.
 *   - Stores everything in one portable file (tasks.db) that opens directly
 *     in DB Browser for SQLite.
 *
 * This file is imported ONLY by the repository layer. No SQL lives here beyond
 * the one-time schema/seed setup; all CRUD SQL stays in the repository.
 */

const path = require('path')
const Database = require('better-sqlite3')

// The .db file lives at the project root so it is easy to find and open in
// DB Browser for SQLite. It is created automatically on first connection.
const DB_PATH = path.join(__dirname, '..', '..', 'tasks.db')

// Opening the connection creates tasks.db if it does not already exist.
const db = new Database(DB_PATH)

// Recommended pragma for better concurrency/durability in typical apps.
db.pragma('journal_mode = WAL')

/**
 * Create the tasks table (if missing) and seed exactly three sample tasks the
 * first time the table is empty. Running this repeatedly is safe: the table is
 * only created IF NOT EXISTS, and seeding is guarded by a COUNT check, so
 * restarting the server never inserts duplicate sample rows.
 */
function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT    NOT NULL,
      done  BOOLEAN DEFAULT 0
    );
  `)

  const { count } = db.prepare('SELECT COUNT(*) AS count FROM tasks').get()

  if (count === 0) {
    const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)')
    const seed = db.transaction((rows) => {
      for (const row of rows) insert.run(row.title, row.done)
    })

    seed([
      { title: 'Learn Node.js', done: 0 },
      { title: 'Learn Express', done: 0 },
      { title: 'Build CRUD API', done: 1 },
    ])

    console.log('[v0] Seeded tasks table with 3 sample tasks.')
  }
}

// Initialize immediately on import so the schema is ready before the first
// repository query executes.
initializeDatabase()

module.exports = { db, initializeDatabase, DB_PATH }
