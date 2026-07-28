/**
 * Task Routes
 * ------------
 * Wires HTTP method + path to a controller handler. Nothing else lives here —
 * no logic, no data access. This is the "map of doors" into the API.
 *
 * Mounted at /api/tasks in app.js, so the full paths are:
 *   GET    /api/tasks
 *   GET    /api/tasks/:id
 *   POST   /api/tasks
 *   PUT    /api/tasks/:id
 *   DELETE /api/tasks/:id
 */

const express = require('express')
const taskController = require('../controllers/taskController')

const router = express.Router()

router.get('/', taskController.getAllTasks)
router.get('/:id', taskController.getTaskById)
router.post('/', taskController.createTask)
router.put('/:id', taskController.updateTask)
router.delete('/:id', taskController.deleteTask)

module.exports = router
