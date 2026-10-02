import { useMemo, useState } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import FilterBar from './components/FilterBar'
import { useLocalStorage } from './hooks/useLocalStorage'
import { FILTERS } from './constants'

// Shown on the very first visit so the app isn't empty.
const STARTER_TODOS = [
  { id: 'starter-1', text: 'Finish the SaiKet Task 3 to-do app', priority: 'high', completed: false },
  { id: 'starter-2', text: 'Double-click a task (or press the pencil) to edit it', priority: 'medium', completed: false },
  { id: 'starter-3', text: 'Set up the Git repository', priority: 'low', completed: true },
]

const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

export default function App() {
  const [todos, setTodos] = useLocalStorage('todos', STARTER_TODOS)
  const [filter, setFilter] = useState('all')

  function addTodo(text, priority) {
    const todo = { id: crypto.randomUUID(), text, priority, completed: false }
    setTodos((prev) => [todo, ...prev])
  }

  function toggleTodo(id) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function updateTodo(id, changes) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)))
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  const counts = useMemo(
    () => ({
      all: todos.length,
      active: todos.filter(FILTERS.active).length,
      completed: todos.filter(FILTERS.completed).length,
    }),
    [todos]
  )

  const visibleTodos = todos.filter(FILTERS[filter])
  const progress = counts.all === 0 ? 0 : Math.round((counts.completed / counts.all) * 100)

  return (
    <div className="min-h-screen px-4 py-10 sm:py-16">
      <main className="mx-auto max-w-xl">
        {/* Header */}
        <header className="mb-8">
          <p className="text-sm font-medium text-muted">{today}</p>
          <div className="mt-1 flex items-end justify-between gap-4">
            <h1 className="font-display text-5xl font-bold tracking-tight">Today</h1>
            <p className="pb-1.5 text-sm text-muted">
              <span className="font-semibold text-ink">{counts.active}</span>{' '}
              {counts.active === 1 ? 'task' : 'tasks'} left
            </p>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div
              className="h-2 overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Tasks completed"
            >
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">{progress}% complete</p>
          </div>
        </header>

        <TodoForm onAdd={addTodo} />

        <section className="mt-4 space-y-4" aria-label="Task list">
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            counts={counts}
            onClearCompleted={clearCompleted}
          />
          <TodoList
            todos={visibleTodos}
            filter={filter}
            onToggle={toggleTodo}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
          />
        </section>

        <footer className="mt-12 text-center text-xs text-muted">
          <p>Tip: double-click a task to edit · Enter to save · Esc to cancel</p>
          <p className="mt-2">
            Built with React + Tailwind by{' '}
            <a
              href="https://github.com/chamindujayasinghe"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-brand"
            >
              Chamindu Jayasinghe
            </a>{' '}
            · SaiKet Systems Internship · Task 03
          </p>
        </footer>
      </main>
    </div>
  )
}
