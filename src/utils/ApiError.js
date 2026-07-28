/**
 * ApiError
 * ---------
 * A tiny Error subclass that carries an HTTP status code alongside the message.
 *
 * The service layer throws these (e.g. `throw new ApiError(404, 'Task not found')`)
 * and the centralized error middleware reads `err.statusCode` to build the
 * correct HTTP response. This keeps HTTP concerns out of the business logic
 * while still letting the business logic decide "not found" vs "bad request".
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 404).
   * @param {string} message    - Human-readable error message.
   */
  constructor(statusCode, message) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    // Mark as operational/expected so the middleware can distinguish these
    // from unexpected programmer errors.
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ApiError
