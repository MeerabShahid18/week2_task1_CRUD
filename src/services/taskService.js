/**
 * Task Service
 * -------------
 * Holds the business logic and rules for tasks. It never touches req/res and
 * never touches the storage array directly — it talks to the repository.
 *
 * Rules enforced here:
 *   - A task must exist to be read/updated/deleted (otherwise 404).
 *   - A task must have a non-empty title to be created (otherwise 400).
 *   - Updates must contain at least one valid field (otherwise 400).
 *
 * Business errors are thrown as ApiError so the controller/middleware can turn
 * them into the right HTTP status + JSON body.
 */

const taskRepository = require('../repositories/taskRepository')
const ApiError = require('../utils/ApiError')

/**
 * Coerce an incoming id (usually a string from the URL) into a valid number.
 * @param {*} rawId
 * @returns {number}
 * @throws {ApiError} 400 when the id is not a valid number.
 */
function parseId(rawId) {
  const id = Number(rawId)
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, 'Invalid task id')
  }
  return id
}

/**
 * Get every task.
 * @returns {Promise<Array>}
 */
async function getAllTasks() {
  return taskRepository.findAll()
}

/**
 * Get a single task by id.
 * @param {*} rawId
 * @returns {Promise<Object>}
 * @throws {ApiError} 404 when no task matches the id.
 */
async function getTaskById(rawId) {
  const id = parseId(rawId)
  const task = await taskRepository.findById(id)
  if (!task) {
    throw new ApiError(404, 'Task not found')
  }
  return task
}

/**
 * Create a new task.
 * @param {{ title?: string, done?: boolean }} body
 * @returns {Promise<Object>}
 * @throws {ApiError} 400 when the title is missing or empty.
 */
async function createTask(body = {}) {
  const { title, done } = body

  if (typeof title !== 'string' || title.trim() === '') {
    throw new ApiError(400, 'Title is required')
  }

  return taskRepository.create({
    title: title.trim(),
    done: done === undefined ? false : Boolean(done),
  })
}

/**
 * Update an existing task.
 * @param {*} rawId
 * @param {{ title?: string, done?: boolean }} body
 * @returns {Promise<Object>}
 * @throws {ApiError} 404 when the task does not exist.
 * @throws {ApiError} 400 when the body has no valid fields or an invalid title.
 */
async function updateTask(rawId, body = {}) {
  const id = parseId(rawId)
  const { title, done } = body

  const changes = {}

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      throw new ApiError(400, 'Title must be a non-empty string')
    }
    changes.title = title.trim()
  }

  if (done !== undefined) {
    if (typeof done !== 'boolean') {
      throw new ApiError(400, 'Done must be a boolean')
    }
    changes.done = done
  }

  if (Object.keys(changes).length === 0) {
    throw new ApiError(400, 'Provide at least one field to update (title or done)')
  }

  const updated = await taskRepository.update(id, changes)
  if (!updated) {
    throw new ApiError(404, 'Task not found')
  }
  return updated
}

/**
 * Delete a task.
 * @param {*} rawId
 * @returns {Promise<void>}
 * @throws {ApiError} 404 when the task does not exist.
 */
async function deleteTask(rawId) {
  const id = parseId(rawId)
  const removed = await taskRepository.remove(id)
  if (!removed) {
    throw new ApiError(404, 'Task not found')
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
}
