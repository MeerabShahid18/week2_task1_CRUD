/**
 * Task Controller
 * ----------------
 * The HTTP layer. Each handler:
 *   1. Pulls data out of the request (params, body).
 *   2. Calls the service to do the real work.
 *   3. Shapes the HTTP response (status code + JSON).
 *
 * Controllers contain NO business logic and NO data access — they translate
 * between HTTP and the service layer. Any error thrown by the service is passed
 * to Express via `next(err)` so the centralized error middleware handles it.
 */

const taskService = require('../services/taskService')

/**
 * GET /api/tasks
 * Return the full list of tasks.
 */
async function getAllTasks(req, res, next) {
  try {
    const tasks = await taskService.getAllTasks()
    res.status(200).json(tasks)
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/tasks/:id
 * Return a single task, or 404 if it does not exist.
 */
async function getTaskById(req, res, next) {
  try {
    const task = await taskService.getTaskById(req.params.id)
    res.status(200).json(task)
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/tasks
 * Create a task. Responds 201 with the created task, or 400 on invalid input.
 */
async function createTask(req, res, next) {
  try {
    const task = await taskService.createTask(req.body)
    res.status(201).json(task)
  } catch (err) {
    next(err)
  }
}

/**
 * PUT /api/tasks/:id
 * Update a task. Responds 200 with the updated task, 400 on invalid input,
 * or 404 if the task does not exist.
 */
async function updateTask(req, res, next) {
  try {
    const task = await taskService.updateTask(req.params.id, req.body)
    res.status(200).json(task)
  } catch (err) {
    next(err)
  }
}

/**
 * DELETE /api/tasks/:id
 * Delete a task. Responds 204 (no body) on success, or 404 if not found.
 */
async function deleteTask(req, res, next) {
  try {
    await taskService.deleteTask(req.params.id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
}
