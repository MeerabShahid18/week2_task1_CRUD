# Task CRUD API — Docker + PostgreSQL

A layered REST CRUD API built with Node.js and Express. This version extends A2 by replacing the SQLite storage layer with PostgreSQL running in Docker. The application and database start together with one command:

```bash
docker compose up --build
```

## Architecture

```text
Client
  |
  v
Routes
  |
  v
Controllers
  |
  v
Services
  |
  v
PostgreSQL Repository
  |
  v
PostgreSQL (Docker + persistent volume)
```

The important architecture proof is that **the routes and service layer were not changed for the storage migration**. In this project, A2 used SQLite as the real database repository; A3 replaces that SQLite repository with PostgreSQL. Only the repository implementation and database configuration changed.

## Stack

- Node.js
- Express
- PostgreSQL
- Docker / Docker Compose
- Swagger UI
- Layered architecture

## Environment variables

Create `.env` locally from `.env.example` if needed. The repository expects:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@db:5432/tasksdb
```

`.env` is gitignored. `.env.example` is committed so the required configuration is documented without committing credentials.

## Run the whole stack

```bash
docker compose up --build
```

The API will be available at:

- http://localhost:3000/
- http://localhost:3000/health
- http://localhost:3000/api/tasks
- http://localhost:3000/docs

Run in the background with:

```bash
docker compose up --build -d
```

## Database

PostgreSQL runs in the `db` container. Its data directory is backed by the named Docker volume `postgres_data`, so deleting/recreating the containers does not delete the database data.

The table is created by `db/init.sql` when the PostgreSQL volume is initialized:

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT FALSE
);
```

The init script runs automatically only when PostgreSQL initializes a new data directory.

## API endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | API metadata |
| GET | `/health` | Health check |
| GET | `/api/tasks` | List tasks |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/docs` | Swagger UI |

## Persistence proof

To verify that data survives both an application restart and a container restart:

1. Start the stack:

```bash
docker compose up --build -d
```

2. Create a task:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Persistence test"}'
```

3. Confirm it exists:

```bash
curl http://localhost:3000/api/tasks
```

4. Restart the app and database containers:

```bash
docker compose restart
```

5. Query the tasks again:

```bash
curl http://localhost:3000/api/tasks
```

The `Persistence test` row remains because PostgreSQL data is stored in the `postgres_data` Docker volume.

For a stronger container-recreation test, use:

```bash
docker compose down

docker compose up --build -d
```

Do **not** run `docker compose down -v`, because `-v` removes the named volume and therefore intentionally deletes the persisted database data.

## Repository swap

The service continues to call the same repository methods:

- `findAll()`
- `findById(id)`
- `create(data)`
- `update(id, changes)`
- `remove(id)`

The PostgreSQL implementation keeps those method signatures, so **the service and route files remain unchanged from A2**. The storage changed from SQLite to PostgreSQL; the higher layers did not. This is the practical benefit of the repository/layered architecture.
