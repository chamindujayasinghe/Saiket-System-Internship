# Task 3 — React To-Do App

A to-do list app built with **React** for the **SaiKet Systems Full Stack Development Internship**. It shows the framework's core features: components, props, state, event handling, list rendering, effects and a custom hook.

## Features

- ➕ **Add** tasks with a priority (high / medium / low); empty or whitespace-only tasks are rejected
- ✏️ **Edit** tasks inline: press the pencil icon or double-click; **Enter** saves, **Esc** cancels
- 🗑️ **Delete** tasks
- ✅ **Mark tasks complete**, with a live progress bar and a "tasks left" counter
- 🔎 **Filter**: All / Active / Completed, with counts
- 🧹 **Clear completed**
- 💾 Tasks are saved in `localStorage` and restored on reload
- 📱 Responsive layout, keyboard accessible, and empty states for each filter

## React Concepts Used

| Concept | Where |
|---|---|
| Function components & props | `TodoForm`, `TodoList`, `TodoItem`, `FilterBar` |
| `useState` | Task list, filter, form input, edit mode |
| Lifting state up | `App` owns the tasks and passes handlers down as props |
| Controlled inputs | Add form and inline edit input |
| List rendering with `key` | `TodoList` |
| Conditional rendering | Edit vs. view mode, empty states, "Clear completed" |
| `useEffect` & `useRef` | Focus management when editing; saving to storage |
| `useMemo` | Task counts |
| Custom hook | `useLocalStorage` |
| Immutable updates | `map` / `filter` / spread in every handler |

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)

## Run Locally

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build in dist/
```

## Project Structure

```
Task-3-Todo-App/
├── index.html
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx                  # State and handlers
    ├── constants.js             # Priorities, filters, max length
    ├── index.css                # Tailwind + theme tokens
    ├── hooks/
    │   └── useLocalStorage.js
    └── components/
        ├── TodoForm.jsx         # Add task
        ├── TodoList.jsx         # List + empty states
        ├── TodoItem.jsx         # View / edit / delete one task
        └── FilterBar.jsx        # Filters + clear completed
```

## Screenshots

_Add screenshots here._
