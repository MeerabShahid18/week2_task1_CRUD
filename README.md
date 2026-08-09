
````markdown
# Task CRUD API — Supabase Authentication + Docker + PostgreSQL

A layered REST CRUD API built with Node.js and Express.

This project started as a simple CRUD API and was progressively extended with:

- Layered architecture
- PostgreSQL database running in Docker
- Persistent Docker volume
- Supabase authentication
- User signup and login
- JWT access-token verification
- Protected routes
- Reusable authentication middleware
- Logout
- Swagger UI with Bearer JWT authentication

The application and database can be started together with:

```bash
docker compose up --build
````

---

## Architecture

```text
Client
  |
  v
Routes
  |
  v
Authentication Middleware
  |
  v
Controllers
  |
  v
Services
  |
  v
Repository
  |
  v
PostgreSQL (Docker + Persistent Volume)

Authentication:

Client
  |
  v
Auth Routes
  |
  v
Supabase Authentication
  |
  v
JWT Access Token
  |
  v
Authentication Middleware
  |
  v
Protected Routes
```

The application follows a layered architecture so that routes and services remain independent from the database implementation.

The repository layer is responsible for communicating with PostgreSQL, while authentication is handled through Supabase.

---

## Features

### CRUD API

* Create tasks
* Read all tasks
* Read a single task
* Update tasks
* Delete tasks
* PostgreSQL persistence

### Authentication

* User signup
* User login
* JWT access-token verification
* Protected routes
* Authentication middleware
* User profile endpoint
* Protected dashboard endpoint
* Logout

### Documentation

* Interactive Swagger UI
* Bearer JWT authentication support
* API endpoint documentation

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Supabase Auth
* Docker
* Docker Compose
* Swagger UI
* OpenAPI 3
* JavaScript
* Layered architecture
* Environment variables

---

## Environment Variables

Create a local `.env` file from `.env.example`.

```env
PORT=3000

DATABASE_URL=postgresql://postgres:postgres@db:5432/tasksdb

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

Never commit the real `.env` file or Supabase credentials to GitHub.

The repository includes `.env.example` so another developer can see which variables are required without exposing secrets.

---

## Local Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

### 2. Create the environment file

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Add your own Supabase credentials to `.env`.

### 3. Install dependencies

```bash
npm install
```

### 4. Start the application and database

```bash
docker compose up --build
```

The API will be available at:

```text
http://localhost:3000/
```

Health check:

```text
http://localhost:3000/health
```

Swagger UI:

```text
http://localhost:3000/docs
```

Run in the background:

```bash
docker compose up --build -d
```

---

# Database

PostgreSQL runs inside the `db` Docker container.

Its data directory is backed by the named Docker volume:

```text
postgres_data
```

This allows database data to survive container restarts and recreation.

The database table is created using:

```text
db/init.sql
```

The `tasks` table contains:

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT FALSE
);
```

The initialization script runs automatically when PostgreSQL initializes a new data directory.

---

# Authentication

Authentication is handled by Supabase Auth.

The API uses Supabase to:

1. Register users
2. Authenticate users
3. Issue JWT access tokens
4. Verify access tokens
5. Retrieve authenticated user information
6. Sign users out

---

## Authentication Flow

```text
Sign Up
   |
   v
POST /auth/signup
   |
   v
Supabase Auth
   |
   v
User Account Created


Login
   |
   v
POST /auth/login
   |
   v
Supabase Auth
   |
   v
Access Token + Refresh Token
   |
   v
Protected API


Protected Request
   |
   v
Authorization: Bearer <JWT>
   |
   v
Auth Middleware
   |
   v
Supabase Token Verification
   |
   +---- Invalid ---> 401 Unauthorized
   |
   +---- Valid -----> Protected Route
```

---

# API Reference

## Public Endpoints

| Method | Endpoint       | Authentication | Description                   |
| ------ | -------------- | -------------- | ----------------------------- |
| GET    | `/`            | No             | API metadata                  |
| GET    | `/health`      | No             | Health check                  |
| POST   | `/auth/signup` | No             | Register a new user           |
| POST   | `/auth/login`  | No             | Log in and receive JWT tokens |
| GET    | `/public/info` | No             | Public information            |

---

## Protected Endpoints

Protected endpoints require:

```http
Authorization: Bearer <access_token>
```

| Method | Endpoint               | Authentication | Description                           |
| ------ | ---------------------- | -------------- | ------------------------------------- |
| GET    | `/protected/profile`   | Yes            | Return authenticated user information |
| GET    | `/protected/dashboard` | Yes            | Protected dashboard endpoint          |
| POST   | `/auth/logout`         | Yes            | Log out the authenticated user        |

---

## Task Endpoints

| Method | Endpoint         | Authentication | Description    |
| ------ | ---------------- | -------------- | -------------- |
| GET    | `/api/tasks`     | No             | List all tasks |
| GET    | `/api/tasks/:id` | No             | Get one task   |
| POST   | `/api/tasks`     | No             | Create a task  |
| PUT    | `/api/tasks/:id` | No             | Update a task  |
| DELETE | `/api/tasks/:id` | No             | Delete a task  |

---

# Authentication Examples

## Sign Up

```http
POST /auth/signup
Content-Type: application/json
```

Request:

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

A successful registration returns:

```text
201 Created
```

---

## Login

```http
POST /auth/login
Content-Type: application/json
```

Request:

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

A successful login returns:

```text
200 OK
```

including:

* Access Token (JWT)
* Refresh Token

The access token can then be used to access protected endpoints.

---

## Protected Profile

```http
GET /protected/profile
Authorization: Bearer <access_token>
```

A valid token returns the authenticated user's information.

An invalid, expired, or modified token returns:

```json
{
  "error": "Invalid or expired token"
}
```

with:

```text
401 Unauthorized
```

---

## Logout

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

A successful logout returns:

```text
204 No Content
```

---

# Authentication Middleware

Token verification is implemented as reusable Express middleware.

Instead of repeating authentication logic inside every protected route, the middleware:

1. Reads the `Authorization` header.
2. Extracts the Bearer token.
3. Verifies the token using Supabase.
4. Rejects missing or invalid tokens.
5. Allows valid authenticated requests to continue.

This middleware is used by protected routes such as:

```text
GET /protected/profile
GET /protected/dashboard
POST /auth/logout
```

---

# Swagger UI

Interactive API documentation is available at:

```text
http://localhost:3000/docs
```

Swagger UI includes Bearer JWT authentication support.

Use the **Authorize** button to provide an access token:

```text
Bearer <your_access_token>
```

After authorization, protected endpoints can be tested directly from Swagger UI.

## Swagger Screenshot

Add the Swagger screenshot here:

```text
docs/swagger.png
```

Then it can be displayed with:

```markdown
![Swagger UI](./docs/swagger.png)
```

---

# Persistence Proof

The PostgreSQL database uses a Docker named volume so data survives container restarts.

To verify persistence:

### 1. Start the stack

```bash
docker compose up --build -d
```

### 2. Create a task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Persistence test"}'
```

### 3. Confirm the task exists

```bash
curl http://localhost:3000/api/tasks
```

### 4. Restart the containers

```bash
docker compose restart
```

### 5. Query the tasks again

```bash
curl http://localhost:3000/api/tasks
```

The `Persistence test` row remains because PostgreSQL data is stored in the `postgres_data` Docker volume.

For a stronger container-recreation test:

```bash
docker compose down
```

Then:

```bash
docker compose up --build -d
```

The data remains available because the named volume is preserved.

Do **not** run:

```bash
docker compose down -v
```

because `-v` removes the named volume and therefore intentionally deletes the persisted database data.

---

# Repository Architecture

The service continues to communicate with the repository through the same interface:

```text
findAll()
findById(id)
create(data)
update(id, changes)
remove(id)
```

The PostgreSQL repository implements these methods while keeping the higher application layers independent from the database implementation.

This demonstrates the practical benefit of the layered architecture: the storage implementation can change without requiring the service and route layers to be rewritten.

---

# Security

* `.env` is ignored by Git.
* Supabase credentials are stored only in local environment variables.
* `.env.example` contains placeholders instead of real credentials.
* Protected routes require a valid Supabase JWT.
* Invalid or expired tokens are rejected with `401 Unauthorized`.

**Never commit real Supabase keys, passwords, or other secrets to GitHub.**

---

# Project Structure

```text
.
├── db/
│   └── init.sql
├── public/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── docs/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

# Running the Project in Under 5 Minutes

A new developer can run the project by following these steps:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
npm install
```

Create `.env` using `.env.example` and add valid Supabase credentials.

Then:

```bash
docker compose up --build
```

Open:

```text
http://localhost:3000/docs
```

The authenticated API and PostgreSQL database are now ready to use.

````

