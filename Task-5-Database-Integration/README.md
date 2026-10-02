# Task 5 — Database Integration (MySQL)

The Task 4 User REST API, now connected to a **MySQL** database, built for the **SaiKet Systems Full Stack Development Internship**. Users are stored and retrieved with **SQL queries**, so data persists across server restarts.

## What Changed from Task 4

| Task 4 | Task 5 |
|---|---|
| In-memory array (`data/userStore.js`) | MySQL table `users` (`models/userModel.js`) |
| Data lost on restart | Data persists in the database |
| Duplicate email checked in JS | `UNIQUE` constraint in MySQL → `409` |
| Sync handlers | `async` handlers using `mysql2/promise` |
| — | Connection pool, `.env` config, health check, DB setup script |

## SQL Used

| Endpoint | Query |
|---|---|
| `GET /api/users` | `SELECT … FROM users ORDER BY id` |
| `GET /api/users/:id` | `SELECT … FROM users WHERE id = ?` |
| `POST /api/users` | `INSERT INTO users (name, email, age) VALUES (?, ?, ?)` |
| `PUT` / `PATCH /api/users/:id` | `UPDATE users SET name = ?, … WHERE id = ?` |
| `DELETE /api/users/:id` | `DELETE FROM users WHERE id = ?` |

Every query uses **`?` placeholders (parameterised queries)**, so user input is never inserted into the SQL text. This protects against SQL injection, and a test checks it.

## Database Schema

```sql
CREATE TABLE users (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)     NOT NULL,
  email       VARCHAR(255)     NOT NULL UNIQUE,
  age         TINYINT UNSIGNED NOT NULL CHECK (age BETWEEN 1 AND 150),
  created_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP        NULL ON UPDATE CURRENT_TIMESTAMP
);
```

The full script is in [`db/schema.sql`](db/schema.sql), and the sample data is in [`db/seed.sql`](db/seed.sql).

## Endpoints

| Method | Route | Description | Success |
|---|---|---|---|
| `GET` | `/api/health` | API + database status | `200` |
| `GET` | `/api/users` | List all users | `200` |
| `GET` | `/api/users/:id` | Get one user | `200` |
| `POST` | `/api/users` | Create a user | `201` |
| `PUT` | `/api/users/:id` | Replace a user (all fields) | `200` |
| `PATCH` | `/api/users/:id` | Update some fields | `200` |
| `DELETE` | `/api/users/:id` | Delete a user | `204` |

Errors: `400` validation / bad id / malformed JSON · `404` not found · `409` duplicate email · `503` database unreachable.

## Setup

**Requirements:** Node.js 18+ and MySQL 8+ running locally.

```bash
npm install

# 1. Configure the connection
cp .env.example .env        # then set DB_PASSWORD (and DB_USER if not root)

# 2. Create the database, table and sample data
npm run db:init             # or: mysql -u root -p < db/schema.sql && mysql -u root -p saiket_users < db/seed.sql

# 3. Start the API
npm start                   # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm start` | Start the API |
| `npm run dev` | Start with auto-restart on file changes |
| `npm run db:init` | Create the database/table if missing and add sample users |
| `npm run db:reset` | Drop and recreate the `users` table with sample data |
| `npm test` | Run the endpoint tests against a separate `saiket_users_test` database |

## Testing

- **Automated:** `npm test` runs 8 tests against a real MySQL test database, covering CRUD, validation, duplicate email, persistence checks with direct SQL, and SQL injection.
- **Postman:** import [`postman_collection.json`](postman_collection.json), run `npm run db:reset`, then run the collection (13 requests with test scripts).
- **Persistence check:** create a user, restart the server, then `GET /api/users`. The user is still there.

## Project Structure

```
Task-5-Database-Integration/
├── server.js                     # Starts the server, checks the DB connection
├── app.js                        # Express app, health check, routes
├── db/
│   ├── config.js                 # Reads .env settings
│   ├── pool.js                   # mysql2 connection pool
│   ├── schema.sql                # CREATE DATABASE / CREATE TABLE
│   └── seed.sql                  # Sample users
├── models/userModel.js           # SQL queries
├── controllers/userController.js # Request handlers (async)
├── routes/users.js               # Route definitions
├── middleware/
│   ├── validateUser.js           # Body + id validation
│   └── errorHandler.js           # 404, MySQL errors, central handler
├── scripts/initDb.js             # npm run db:init / db:reset
├── tests/users.test.js           # Automated tests (node:test)
├── postman_collection.json
└── .env.example                  # Copy to .env (never commit .env)
```

## Skills Shown

Basic SQL (`CREATE`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`, constraints) · database connection with a pool · parameterised queries · integrating SQL with Express endpoints · environment configuration · error mapping (MySQL → HTTP)
