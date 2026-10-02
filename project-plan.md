# Project Plan — SaiKet Systems Full Stack Development Internship

> **Companion to:** [project-scope.md](project-scope.md)
> **Start date:** 2026-10-01
> **Planned duration:** 6 weeks (the brief gives no duration, so adjust the dates once the official timeline is known)

---

## 1. Approach

Work through the tasks in order, because each one builds on the last:

```
Task 1 ─┐
Task 2 ─┼─► Front-end skills ──► Task 3 (framework) ──┐
        │                                              ├──► Task 6 (full stack) ──► Video ──► Submit
        └─► Task 4 (API) ──► Task 5 (database) ────────┘
```

- **Tasks 1–2:** static front-end basics, done quickly.
- **Task 3:** learn the chosen framework. Its components and patterns get reused in Task 6.
- **Tasks 4–5:** build the back-end once and extend it. The Task 5 server becomes the Task 6 server.
- **Task 6:** put the pieces together. This is the main piece in the video.

Record screen clips as each task is finished so the video does not have to be made from scratch at the end.

---

## 2. Technology Decisions

Settle these before the work starts and keep them the same through Task 6.

| Decision | Options | Recommendation | Reason |
|---|---|---|---|
| CSS framework | Bootstrap / Tailwind | ✅ **Tailwind CSS** (decided) | Used in all tasks, so the styling stays consistent and pairs well with React |
| Front-end framework | React.js / Angular | ✅ **React.js with Vite** (decided) | Easier to learn, quick setup, carries straight into Task 6 |
| Database | MySQL / PostgreSQL | **MySQL** *(or PostgreSQL)* | Both are fine. Pick whichever is easier to install on your machine |
| DB driver | `mysql2` / `pg` | Matches the database | Supports promises and parameterised queries |
| HTTP client (Task 6) | `fetch` / Axios | **Axios** | Cleaner error handling and a configurable base URL |
| Version control | Git + GitHub | **One repo, one folder per task** | Public proof of original work |

**Tools to install:** Node.js (LTS), Git, VS Code, Postman, MySQL Server + Workbench (or PostgreSQL + pgAdmin), and a screen recorder (OBS Studio).

---

## 3. Timeline

| Week | Dates | Focus | Milestones |
|---|---|---|---|
| 1 | Oct 1 – Oct 7 | Setup, Task 1, Task 2 | M1, M2 |
| 2 | Oct 8 – Oct 14 | Task 3 (learn framework + to-do app) | M3 |
| 3 | Oct 15 – Oct 21 | Task 4 (REST API + Postman) | M4 |
| 4 | Oct 22 – Oct 28 | Task 5 (database integration) | M5 |
| 5 | Oct 29 – Nov 4 | Task 6 (full-stack User Management System) | M6 |
| 6 | Nov 5 – Nov 11 | Polish, READMEs, video, LinkedIn post, submission | M7, M8 |

**Buffer:** Week 6 also absorbs any slippage from Weeks 1–5.

---

## 4. Detailed Work Plan

### Phase 0 — Setup (Day 1)

- [ ] Install the tools listed in Section 2.
- [ ] Create the GitHub repo `saiket-fullstack-internship` and clone it into this folder.
- [ ] Create the six task folders (see scope §5) and a root `README.md`.
- [ ] Add a root `.gitignore` (`node_modules/`, `.env`, `dist/`, `build/`).
- [ ] Update the LinkedIn profile with the internship and its hashtags (scope §8).

---

### Phase 1 — Task 1: Portfolio Website (Days 2–4)

| Step | Work |
|---|---|
| 1 | Pick a theme (colour palette, fonts) and sketch the layout |
| 2 | Build `index.html` with navbar, hero, about, projects, contact, footer |
| 3 | Add Tailwind and style each section responsively |
| 4 | Build 3–6 placeholder project cards (image, title, description, links) |
| 5 | Write `script.js` contact validation: required fields, email regex, inline errors, success message |
| 6 | Test at mobile, tablet and desktop widths, then fix layout bugs |
| 7 | Write the README, take screenshots and commit |

**Done when:** every acceptance criterion in scope §4 Task 1 is checked.

---

### Phase 2 — Task 2: E-Commerce Landing Page (Days 5–7)

| Step | Work |
|---|---|
| 1 | Pick a store concept (e.g. sneakers, electronics, coffee) |
| 2 | Build sections: hero, featured products, categories, testimonials, newsletter, footer |
| 3 | Make it responsive with Tailwind grid/flex utilities |
| 4 | Add vanilla JS features: mobile menu toggle, dark/light mode toggle, newsletter email validation, add-to-cart counter |
| 5 | Test responsiveness and check there is no horizontal scroll |
| 6 | Write the README, take screenshots, commit and record a short screen clip |

---

### Phase 3 — Task 3: To-Do App (Week 2)

| Step | Work |
|---|---|
| 1 | Days 1–2: learn the framework basics (official tutorial: components, props, state, events, lists) |
| 2 | Scaffold the app: `npm create vite@latest todo-app -- --template react` |
| 3 | Plan components: `App` → `TodoForm`, `TodoList` → `TodoItem` |
| 4 | Add task (reject empty or whitespace-only input) |
| 5 | Edit task (switch to inline edit mode, then save or cancel) |
| 6 | Delete task |
| 7 | Style the UI with Tailwind. Optional: complete toggle, filter, `localStorage` |
| 8 | Write the README, take screenshots, commit and record a clip |

**Carry forward:** the form and list component patterns get reused in Task 6.

---

### Phase 4 — Task 4: REST API (Week 3)

| Step | Work |
|---|---|
| 1 | `npm init -y`, then install `express`, `cors`, `dotenv`, plus `nodemon` as a dev dependency |
| 2 | Structure: `server.js`, `routes/users.js`, `controllers/userController.js`, `middleware/validateUser.js` |
| 3 | Store users in an in-memory array |
| 4 | Build `GET /api/users` and `GET /api/users/:id` |
| 5 | Build `POST /api/users` with validation (name required, valid unique email, positive integer age) |
| 6 | Build `PUT /api/users/:id` and `DELETE /api/users/:id` |
| 7 | Add a 404 route handler and a central error-handling middleware |
| 8 | Postman: create a collection with success and failure cases for every endpoint, then export it as `postman_collection.json` |
| 9 | Write the README (endpoint table and sample requests/responses), then commit |

---

### Phase 5 — Task 5: Database Integration (Week 4)

| Step | Work |
|---|---|
| 1 | Learn basic SQL: `CREATE TABLE`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `WHERE` |
| 2 | Copy the Task 4 code into the Task 5 folder |
| 3 | Write `schema.sql` (see below) and run it |
| 4 | Add `db.js` with a connection pool that reads credentials from `.env`, and add a `.env.example` |
| 5 | Replace the in-memory logic with parameterised SQL queries in each controller |
| 6 | Map DB errors to HTTP responses (duplicate email → `409`, not found → `404`) |
| 7 | Re-run the Postman collection, restart the server and confirm the data is still there |
| 8 | Write the README (DB setup steps and schema), then commit |

```sql
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,   -- PostgreSQL: SERIAL PRIMARY KEY
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  age        INT CHECK (age > 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### Phase 6 — Task 6: User Management System (Week 5)

| Step | Work |
|---|---|
| 1 | Set up `server/` (copied from Task 5, with CORS enabled for the client URL) |
| 2 | Set up `client/` (React + Vite + Tailwind + React Router + Axios) |
| 3 | Add an API service module (`src/api/users.js`) with `getUsers`, `getUser`, `createUser`, `updateUser`, `deleteUser` |
| 4 | Build pages: **User List** (`/`), **User Detail** (`/users/:id`), **Create User** (`/users/new`), **Edit User** (`/users/:id/edit`) |
| 5 | Build a shared `UserForm` component with validation, used for both create and edit |
| 6 | Delete with a confirmation dialog |
| 7 | Add loading, empty and error states, plus success feedback (toasts or alerts) |
| 8 | Make the UI responsive |
| 9 | *(Optional)* Add login with JWT and bcrypt-hashed passwords |
| 10 | Test the whole flow: create → view → edit → delete, with page reloads in between |
| 11 | Write the README (how to run the server and client, environment variables, screenshots), then commit |

---

### Phase 7 — Video, LinkedIn & Submission (Week 6)

| Step | Work |
|---|---|
| 1 | Final pass on every task: fix bugs, check READMEs, remove console logs |
| 2 | Write the video script (see outline below) |
| 3 | Record the remaining clips in OBS at 1080p, with a clean desktop and the browser zoom adjusted |
| 4 | Edit the video (target 3–5 minutes), adding captions or text overlays for each task |
| 5 | Post it on LinkedIn: tag @saiketsystems, add the hashtags, link the GitHub repo |
| 6 | Fill in the submission form when SaiKet Systems shares it |

**Video outline (~4 min)**

| Time | Segment |
|---|---|
| 0:00–0:20 | Introduction: name, SaiKet Systems Full Stack internship |
| 0:20–0:50 | Task 1: portfolio, responsive view, form validation |
| 0:50–1:15 | Task 2: landing page, interactive toggles |
| 1:15–1:45 | Task 3: to-do app add/edit/delete |
| 1:45–2:30 | Tasks 4–5: Postman CRUD demo, data shown in the DB |
| 2:30–3:40 | Task 6: full User Management flow |
| 3:40–4:00 | Skills learned, thanks, GitHub link |

**LinkedIn post hashtags:** `#saiketsystems #saiket #saiketsys #SaiKetInnovation #SaiKetAchievements #SaiKetProjects #FullStackDevelopment`

---

## 5. Git Workflow

- One repository, one folder per task.
- Commit small and often with clear messages, e.g. `task4: add POST /api/users validation`.
- Tag each finished task: `git tag task-1-complete`.
- Never commit `.env` or `node_modules/`.

---

## 6. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Learning the framework takes longer than planned | Delays Tasks 3 and 6 | Stick to the core concepts only and use Week 6 as buffer |
| Database install or connection problems on Windows | Blocks Task 5 | Install early (Week 3). If needed, use a free hosted DB (e.g. Aiven, Neon, Railway) |
| CORS errors connecting the client to the API | Blocks Task 6 | Set up the `cors` middleware early and use a Vite proxy in development |
| Plagiarism concerns | Termination of the internship | Write all code yourself, cite any tutorials in READMEs, keep the commit history visible |
| Video quality | Weak submission | Record clips per task as you go and script before recording |

---

## 7. Progress Tracker

| Milestone | Target | Status |
|---|---|---|
| M1 — Task 1 complete | Oct 4 | ✅ Done (Oct 2) |
| M2 — Task 2 complete | Oct 7 | ✅ Done (Oct 2) |
| M3 — Task 3 complete | Oct 14 | ⬜ Not started |
| M4 — Task 4 complete | Oct 21 | ⬜ Not started |
| M5 — Task 5 complete | Oct 28 | ⬜ Not started |
| M6 — Task 6 complete | Nov 4 | ⬜ Not started |
| M7 — Video posted on LinkedIn | Nov 9 | ⬜ Not started |
| M8 — Submission form completed | When released | ⬜ Not started |

*Status key: ⬜ Not started · 🟨 In progress · ✅ Done*
