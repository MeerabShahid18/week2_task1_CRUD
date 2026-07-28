# Task CRUD API

A small REST API for managing a to-do list — create, read, update, and delete tasks (the four **CRUD** operations). Built with **Node.js + Express** using a strict **layered architecture**. Data lives **in memory** (a plain array), so it resets every time the server restarts. This is intentional: the project is structured so the storage layer can later be swapped for **SQLite** without touching any other layer.

Interactive documentation is served with **Swagger UI** at `/docs`.

---

## Architecture

This project follows a strict layered architecture. A request flows **down** through the layers and the response flows back **up**:

```
Client Request
      |
      v
Routes Layer        -> defines endpoints only (no logic)
      |
      v
Controller Layer    -> handles HTTP req/res, validates presence of input
      |
      v
Service Layer       -> business logic + validation rules (no req/res)
      |
      v
Repository Layer    -> all data access (today: in-memory array; later: SQLite)
      |
      v
In-memory storage
```

**Why this matters:** each layer has a single responsibility and only talks to the layer directly below it. When we add a database next week, only `taskRepository.js` changes — the routes, controller, and service stay exactly the same.

### Layer responsibilities

| Layer | File | Responsibility |
| --- | --- | --- |
| Routes | `src/routes/taskRoutes.js` | Map HTTP method + path to a controller handler. No logic. |
| Controllers | `src/controllers/taskController.js` | Read the request, call the service, shape the HTTP response. |
| Services | `src/services/taskService.js` | Business logic and validation rules. Never touches req/res. |
| Repositories | `src/repositories/taskRepository.js` | All data operations. The only layer that touches storage. |
| Models | `src/models/taskModel.js` | Defines the Task structure. |
| Middleware | `src/middleware/errorMiddleware.js` | Centralized error handling + 404 fallback. |

---

## Folder structure

```
.
├── src/
│   ├── controllers/
│   │   └── taskController.js     # HTTP request/response handling
│   ├── services/
│   │   └── taskService.js        # Business logic + validation
│   ├── repositories/
│   │   └── taskRepository.js     # In-memory data storage (swap for DB later)
│   ├── routes/
│   │   └── taskRoutes.js         # Endpoint definitions
│   ├── models/
│   │   └── taskModel.js          # Task structure/factory
│   ├── middleware/
│   │   └── errorMiddleware.js    # Centralized error + 404 handling
│   ├── docs/
│   │   └── openapi.js            # OpenAPI 3 spec for Swagger UI
│   ├── utils/
│   │   └── ApiError.js           # Error class carrying an HTTP status code
│   ├── app.js                    # Express app: middleware + routes wiring
│   └── server.js                 # Entry point: starts the server
├── .env                          # PORT config
├── .gitignore
├── package.json
└── README.md
```

---

## The Task object

```json
{
  "id": 1,
  "title": "Learn Node.js",
  "done": false
}
```

The repository is seeded with three default tasks on startup:

```json
[
  { "id": 1, "title": "Learn Node.js",  "done": false },
  { "id": 2, "title": "Learn Express",  "done": false },
  { "id": 3, "title": "Build CRUD API", "done": true  }
]
```

---

## API endpoints

Base path for task resources: `/api/tasks`

| Method | Path | Description | Success | Errors |
| --- | --- | --- | --- | --- |
| `GET` | `/` | API metadata | `200` | — |
| `GET` | `/health` | Health check (`{ "status": "ok" }`) | `200` | — |
| `GET` | `/api/tasks` | List all tasks | `200` | — |
| `GET` | `/api/tasks/:id` | Get a single task | `200` | `404` not found |
| `POST` | `/api/tasks` | Create a task | `201` | `400` missing/empty title |
| `PUT` | `/api/tasks/:id` | Update a task (`title` and/or `done`) | `200` | `400` invalid body · `404` not found |
| `DELETE` | `/api/tasks/:id` | Delete a task | `204` | `404` not found |
| `GET` | `/docs` | Swagger UI interactive docs | `200` | — |

All errors return JSON in the form `{ "error": "message" }`.

### Status codes used

| Code | Meaning | When |
| --- | --- | --- |
| `200` | OK | Successful read / update |
| `201` | Created | Task created via `POST` |
| `204` | No Content | Task deleted (empty body) |
| `400` | Bad Request | Missing/empty title, or invalid update body |
| `404` | Not Found | Unknown task id (or unknown route) |
| `500` | Server Error | Unexpected error |

---

## Install

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
```

## Run

Start the server (one documented command):

```bash
npm start
```

The server starts on `http://localhost:3000` (configurable via `PORT` in `.env`).

For auto-reload during development:

```bash
npm run dev
```

Then open:

- API root: <http://localhost:3000/>
- Swagger UI: <http://localhost:3000/docs>

---

## Example: full CRUD cycle with `curl`

```bash
# List all tasks
curl -i http://localhost:3000/api/tasks

# Get one task
curl -i http://localhost:3000/api/tasks/1

# Create a task (201)
curl -i -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk"}'

# Update a task (200)
curl -i -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Express","done":true}'

# Delete a task (204)
curl -i -X DELETE http://localhost:3000/api/tasks/2
```

### Sample `curl -i` output

```
$ curl -i -X POST http://localhost:3000/api/tasks \
    -H "Content-Type: application/json" \
    -d '{"title":"Buy milk"}'

HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Content-Length: 40

{"id":4,"title":"Buy milk","done":false}
```

---

## Note on in-memory storage (the "mortality experiment")

Data is stored in a plain array in `taskRepository.js`. Create a few tasks, restart the server, then `GET /api/tasks` — your new tasks are gone and only the three seeded tasks remain. That is because in-memory data lives only in the running process and disappears when it stops. Fixing this is exactly why databases exist, and is the goal of the next iteration (SQLite), which will only require rewriting the repository layer.
