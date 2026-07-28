/**
 * OpenAPI 3.0 specification for the Task CRUD API.
 * -------------------------------------------------
 * Swagger UI (mounted at /docs in app.js) reads this object and renders
 * interactive documentation with a working "Try it out" button for every
 * endpoint. Kept as a plain JS object so it can be required directly.
 */

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Task API',
    version: '1.0.0',
    description:
      'A simple CRUD API for managing tasks, built with Express using a clean layered architecture (routes → controller → service → repository → in-memory storage).',
  },
  servers: [{ url: '/', description: 'Current server' }],
  tags: [
    { name: 'Meta', description: 'Service metadata and health' },
    { name: 'Tasks', description: 'CRUD operations for tasks' },
  ],
  components: {
    schemas: {
      Task: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Learn Node.js' },
          done: { type: 'boolean', example: false },
        },
        required: ['id', 'title', 'done'],
      },
      NewTask: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Buy milk' },
          done: { type: 'boolean', example: false },
        },
        required: ['title'],
      },
      UpdateTask: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Learn Express' },
          done: { type: 'boolean', example: true },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Task not found' },
        },
      },
    },
  },
  paths: {
    '/': {
      get: {
        tags: ['Meta'],
        summary: 'API root — describes the API',
        responses: {
          200: {
            description: 'API metadata',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Task API' },
                    version: { type: 'string', example: '1.0' },
                    endpoints: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['/api/tasks'],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        tags: ['Meta'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Server is alive',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { status: { type: 'string', example: 'ok' } },
                },
              },
            },
          },
        },
      },
    },
    '/api/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'List all tasks',
        responses: {
          200: {
            description: 'An array of tasks',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create a new task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NewTask' },
            },
          },
        },
        responses: {
          201: {
            description: 'Task created',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Task' } },
            },
          },
          400: {
            description: 'Validation error (missing/empty title)',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } },
            },
          },
        },
      },
    },
    '/api/tasks/{id}': {
      get: {
        tags: ['Tasks'],
        summary: 'Get a single task by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            example: 1,
          },
        ],
        responses: {
          200: {
            description: 'The requested task',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Task' } },
            },
          },
          404: {
            description: 'Task not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } },
            },
          },
        },
      },
      put: {
        tags: ['Tasks'],
        summary: 'Update an existing task',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateTask' },
            },
          },
        },
        responses: {
          200: {
            description: 'The updated task',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Task' } },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } },
            },
          },
          404: {
            description: 'Task not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } },
            },
          },
        },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Delete a task',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            example: 1,
          },
        ],
        responses: {
          204: { description: 'Task deleted (no content)' },
          404: {
            description: 'Task not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } },
            },
          },
        },
      },
    },
  },
}

module.exports = openApiSpec
