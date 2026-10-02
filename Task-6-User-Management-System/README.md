# Task 6 — Full Stack User Management System

**Roster** is a full-stack User Management System built for the **SaiKet Systems Full Stack Development Internship**. It combines a React front-end with the Express + MySQL back-end from Tasks 4 and 5. Users can **create, view, update and delete** profiles, and every screen shows live data from the database.

```
┌──────────────────┐   /api/*    ┌──────────────────┐   SQL    ┌──────────┐
│  React client    │ ──────────► │  Express API     │ ───────► │  MySQL   │
│  Vite · Tailwind │ ◄────────── │  Node.js         │ ◄─────── │  users   │
│  localhost:5173  │    JSON     │  localhost:3000  │   rows   │  table   │
└──────────────────┘             └──────────────────┘          └──────────┘
```

## Features

**Profiles (CRUD)**
- **Create**: form with client-side validation, plus server errors shown on the right field (e.g. "email already exists")
- **View**: list of all users (a table on desktop, cards on mobile) and a profile page for each user
- **Update**: edit form pre-filled with the current values
- **Delete**: confirmation dialog before removing a user from the database

**Usability**
- Search by name or email (server-side SQL `LIKE`, debounced, stored in the URL as `?q=`)
- Stats: total users, average age, newest member
- Loading, empty, error (with "Try again") and 404 states
- Pop-up notifications after each create, update and delete
- Responsive layout, keyboard accessible, native `<dialog>` for the confirmation modal

## Tech Stack

| Layer | Technology |
|---|---|
| Front-end | React 19, React Router 7, Axios, Tailwind CSS v4, Vite |
| Back-end | Node.js, Express 5, mysql2, dotenv, cors |
| Database | MySQL (`users` table with `UNIQUE` email and `CHECK` on age) |
| Testing | `node:test` endpoint tests against a MySQL test DB · Postman collection |

## Setup

**Requirements:** Node.js 18+ and a running MySQL 8+ server.

### 1. Back-end

```bash
cd server
npm install
cp .env.example .env     # set DB_PASSWORD (and DB_USER if not root)
npm run db:init          # creates the saiket_user_management database + sample users
npm start                # http://localhost:3000
```

### 2. Front-end (in a second terminal)

```bash
cd client
npm install
npm run dev              # http://localhost:5173
```

Open **http://localhost:5173**. In development, Vite forwards every `/api` request to the Express server (see `client/vite.config.js`), so no extra configuration is needed.

## API

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | API + database status |
| `GET` | `/api/users?search=` | List users, newest first (optional search) |
| `GET` | `/api/users/:id` | Get one user |
| `POST` | `/api/users` | Create a user |
| `PUT` | `/api/users/:id` | Update a user |
| `PATCH` | `/api/users/:id` | Update some fields |
| `DELETE` | `/api/users/:id` | Delete a user |

Errors: `400` validation · `404` not found · `409` duplicate email · `503` database unreachable.

## Testing

```bash
cd server
npm test     # 9 endpoint tests against a separate saiket_user_management_test database
```

Postman: import `server/postman_collection.json` and run the collection.

## Project Structure

```
Task-6-User-Management-System/
├── client/                          # React front-end
│   ├── vite.config.js               # Tailwind plugin + /api proxy
│   └── src/
│       ├── main.jsx                 # Router + toast provider
│       ├── App.jsx                  # Routes
│       ├── api/users.js             # Axios calls + error helpers
│       ├── hooks/useFetch.js        # Data loading with cancellation
│       ├── context/ToastContext.jsx # Notifications
│       ├── components/              # Layout, UserForm, ConfirmDialog, Avatar, States
│       ├── pages/                   # UserList, UserDetail, CreateUser, EditUser, NotFound
│       └── utils/format.js
└── server/                          # Express + MySQL API (from Task 5, plus search + CORS)
    ├── app.js · server.js
    ├── db/ (schema.sql, seed.sql, pool.js, config.js)
    ├── models/ · controllers/ · routes/ · middleware/
    ├── scripts/initDb.js
    └── tests/users.test.js
```

## Screenshots

_Add screenshots of the user list, profile page, create/edit form and delete dialog here._
