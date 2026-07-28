/**
 * Task Model
 * -----------
 * Defines the shape/structure of a Task entity and a small factory helper.
 * Keeping the "what a task looks like" concern in one place means every other
 * layer (repository, service, controller) agrees on the same structure.
 *
 * Task shape:
 *   {
 *     id:    number,
 *     title: string,
 *     done:  boolean
 *   }
 */

/**
 * Create a normalized Task object.
 *
 * @param {Object} params
 * @param {number} params.id     - Unique identifier for the task.
 * @param {string} params.title  - Human-readable task title.
 * @param {boolean} [params.done=false] - Whether the task is completed.
 * @returns {{ id: number, title: string, done: boolean }}
 */
function createTask({ id, title, done = false }) {
  return {
    id,
    title,
    done: Boolean(done),
  }
}

module.exports = { createTask }
