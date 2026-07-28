/**
 * server.js
 * ----------
 * The entry point. Loads environment variables, imports the configured Express
 * app, and starts listening on the configured port.
 *
 * Keeping this separate from app.js means the app can be imported (e.g. by
 * tests) without automatically opening a network port.
 */

require('dotenv').config()

const app = require('./app')

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`[v0] Task API server running on http://localhost:${PORT}`)
  console.log(`[v0] Swagger UI available at   http://localhost:${PORT}/docs`)
})
