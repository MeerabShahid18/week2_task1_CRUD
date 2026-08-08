/**
 * Task Repository
 *
 * The ONLY application layer that talks to PostgreSQL. It intentionally keeps
 * the same method interface used by the service layer, so routes/controllers/
 * services do not need to know whether storage is SQLite, PostgreSQL, or an
 * in-memory implementation.
 */

const { pool } = require('../config/database')
const { createTask } = require('../models/taskModel')

function rowToTask(row) {
  return createTask({
    id: row.id,
    title: row.title,
    done: row.done,
  })
}

async function findAll() {
  const result = await pool.query(
    'SELECT id, title, done FROM tasks ORDER BY id ASC'
  )
  return result.rows.map(rowToTask)
}

async function findById(id) {
  const result = await pool.query(
    'SELECT id, title, done FROM tasks WHERE id = $1',
    [id]
  )

  return result.rows[0] ? rowToTask(result.rows[0]) : undefined
}

async function create({ title, done = false }) {
  const result = await pool.query(
    `INSERT INTO tasks (title, done)
     VALUES ($1, $2)
     RETURNING id, title, done`,
    [title, done]
  )

  return rowToTask(result.rows[0])
}

async function update(id, changes) {
  const fields = []
  const values = []

  if (changes.title !== undefined) {
    fields.push(`title = $${values.length + 1}`)
    values.push(changes.title)
  }

  if (changes.done !== undefined) {
    fields.push(`done = $${values.length + 1}`)
    values.push(changes.done)
  }

  if (fields.length === 0) {
    return findById(id)
  }

  values.push(id)

  const result = await pool.query(
    `UPDATE tasks
     SET ${fields.join(', ')}
     WHERE id = $${values.length}
     RETURNING id, title, done`,
    values
  )

  return result.rows[0] ? rowToTask(result.rows[0]) : undefined
}

async function remove(id) {
  const result = await pool.query(
    'DELETE FROM tasks WHERE id = $1',
    [id]
  )

  return result.rowCount > 0
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
}
