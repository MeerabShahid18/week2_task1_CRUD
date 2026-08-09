/**
 * app.js
 * -------
 * Builds and configures the Express application:
 *   - Global middleware (JSON body parsing)
 *   - Meta routes (root + health)
 *   - Swagger UI documentation at /docs
 *   - Feature routes (/api/tasks)
 *   - 404 + centralized error handling (registered LAST)
 *
 * It does NOT start the server — that is server.js's job. Separating app
 * creation from server startup keeps the app importable for tests.
 */

const express = require('express')
const swaggerUi = require('swagger-ui-express')

const taskRoutes = require('./routes/taskRoutes')
const openApiSpec = require('./docs/openapi')
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware')

const authRoutes = require("./routes/authRoutes");
const publicRoutes = require("./routes/publicRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const app = express()

// --- Global middleware -----------------------------------------------------
// Parse incoming JSON request bodies into req.body.
app.use(express.json())
app.use("/auth", authRoutes);
app.use("/public", publicRoutes);
app.use("/protected", protectedRoutes);
// --- Meta endpoints --------------------------------------------------------
// Root: describes the API.
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['/api/tasks', '/health', '/docs'],
  })
})

// Health check: used to confirm the server is alive.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// --- Interactive docs ------------------------------------------------------
// Swagger UI reads the OpenAPI spec and renders a "Try it out" console.
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec))

// --- Feature routes --------------------------------------------------------
app.use('/api/tasks', taskRoutes)

// --- Error handling (must be registered after all routes) ------------------
app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
