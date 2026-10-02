import { useState } from 'react'
import { MAX_LENGTH, PRIORITIES } from '../constants'

export default function TodoForm({ onAdd }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = text.trim()

    if (!trimmed) {
      setError('Please type a task first.')
      return
    }

    onAdd(trimmed, priority)
    setText('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        className={`flex flex-col sm:flex-row gap-2 rounded-2xl bg-card p-2 shadow-sm ring-1 transition-shadow focus-within:ring-2 ${
          error ? 'ring-danger' : 'ring-line focus-within:ring-brand'
        }`}
      >
        <label htmlFor="new-task" className="sr-only">New task</label>
        <input
          id="new-task"
          type="text"
          value={text}
          maxLength={MAX_LENGTH}
          onChange={(e) => {
            setText(e.target.value)
            if (error) setError('')
          }}
          placeholder="What needs to be done?"
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby="new-task-error"
          className="flex-1 min-w-0 bg-transparent px-3 py-2.5 text-[15px] placeholder:text-muted/70 focus:outline-none"
        />

        <div className="flex gap-2">
          <label htmlFor="new-priority" className="sr-only">Priority</label>
          <select
            id="new-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="flex-1 sm:flex-none rounded-xl bg-canvas px-3 py-2.5 text-sm font-medium capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand"
          >
            Add task
          </button>
        </div>
      </div>

      <p id="new-task-error" className="mt-2 px-1 text-sm text-danger min-h-5" aria-live="polite">
        {error}
      </p>
    </form>
  )
}
