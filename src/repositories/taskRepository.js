/**
 * Task Repository
 * ----------------
 * The ONLY layer that touches the data storage.
 *
 * Right now storage is a plain in-memory array. Later this whole file can be
 * rewritten to run SQLite (or any DB) queries WITHOUT changing the service,
 * controller, or route layers — that is the point of the repository pattern.
 *
 * Every method is declared `async` on purpose: a real database driver returns
 * promises, so writing the interface as async today means the swap to SQLite
 * later requires zero changes in the service layer.
 */

const { createTask } = require('../models/taskModel')

/**
 * In-memory data store, seeded with three default tasks.
 * @type {Array<{ id: number, title: string, done: boolean }>}
 */
let tasks = [
  createTask({ id: 1, title: 'Learn Node.js', done: false }),
  createTask({ id: 2, title: 'Learn Express', done: false }),
  createTask({ id: 3, title: 'Build CRUD API', done: true }),
]

/**
 * Tracks the next id to assign. Starts after the highest seeded id so that
 * ids remain unique even after deletes.
 * @type {number}
 */
let nextId = tasks.length + 1

/**
 * Return all tasks.
 * @returns {Promise<Array>}
 */
async function findAll() {
  return tasks
}

/**
 * Find a single task by id.
 * @param {number} id
 * @returns {Promise<Object|undefined>} The task, or undefined if not found.
 */
async function findById(id) {
  return tasks.find((task) => task.id === id)
}

/**
 * Persist a new task.
 * @param {{ title: string, done?: boolean }} data
 * @returns {Promise<Object>} The created task (with generated id).
 */
async function create({ title, done = false }) {
  const task = createTask({ id: nextId++, title, done })
  tasks.push(task)
  return task
}

/**
 * Update an existing task in place.
 * @param {number} id
 * @param {{ title?: string, done?: boolean }} changes
 * @returns {Promise<Object|undefined>} The updated task, or undefined if missing.
 */
async function update(id, changes) {
  const task = tasks.find((t) => t.id === id)
  if (!task) return undefined

  if (changes.title !== undefined) task.title = changes.title
  if (changes.done !== undefined) task.done = Boolean(changes.done)

  return task
}

/**
 * Remove a task by id.
 * @param {number} id
 * @returns {Promise<boolean>} true if a task was removed, false otherwise.
 */
async function remove(id) {
  const index = tasks.findIndex((task) => task.id === id)
  if (index === -1) return false

  tasks.splice(index, 1)
  return true
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
}
