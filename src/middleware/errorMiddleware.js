/**
 * Error Middleware
 * -----------------
 * Centralized error handling for the whole app. Instead of every controller
 * formatting its own error responses, they just call `next(err)` and this
 * middleware turns the error into a consistent JSON response.
 *
 * Exposes two pieces:
 *   - notFoundHandler: catches requests to unknown routes (404).
 *   - errorHandler:    the final error-handling middleware (must have 4 args).
 */

const ApiError = require('../utils/ApiError')

/**
 * 404 handler for any route that did not match.
 * Runs after all routes; forwards a 404 ApiError to the error handler.
 */
function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

/**
 * Centralized error handler.
 *
 * Express identifies this as an error handler because it has four arguments.
 * Known/operational errors (ApiError) keep their status code; anything else
 * is treated as an unexpected 500. Always responds with JSON.
 *
 * eslint-disable-next-line no-unused-vars — `next` is required for Express to
 * recognize this as an error-handling middleware.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode =
    err instanceof ApiError && err.statusCode ? err.statusCode : 500

  const message =
    err instanceof ApiError ? err.message : 'Internal Server Error'

  // Log unexpected (non-operational) errors for debugging.
  if (!(err instanceof ApiError)) {
    console.error('[v0] Unexpected error:', err)
  }

  res.status(statusCode).json({ error: message })
}

module.exports = {
  notFoundHandler,
  errorHandler,
}
