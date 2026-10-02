import { useEffect, useRef, useState } from 'react'
import { MAX_LENGTH, PRIORITIES } from '../constants'

const PRIORITY_STYLES = {
  high: 'bg-high',
  medium: 'bg-medium',
  low: 'bg-low',
}

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const [draftPriority, setDraftPriority] = useState(todo.priority)
  const inputRef = useRef(null)
  const editButtonRef = useRef(null)
  const wasEditing = useRef(false)

  // Focus the input when editing starts, and return focus to Edit when it ends.
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    } else if (wasEditing.current) {
      editButtonRef.current?.focus()
    }
    wasEditing.current = isEditing
  }, [isEditing])

  function startEditing() {
    setDraft(todo.text)
    setDraftPriority(todo.priority)
    setIsEditing(true)
  }

  function save() {
    const trimmed = draft.trim()
    if (!trimmed) return // keep editing until there's text, or the user cancels
    onUpdate(todo.id, { text: trimmed, priority: draftPriority })
    setIsEditing(false)
  }

  function cancel() {
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') cancel()
  }

  if (isEditing) {
    return (
      <li className="animate-slide-in rounded-2xl bg-card p-3 shadow-sm ring-2 ring-brand">
        <label htmlFor={`edit-${todo.id}`} className="sr-only">Edit task</label>
        <input
          id={`edit-${todo.id}`}
          ref={inputRef}
          type="text"
          value={draft}
          maxLength={MAX_LENGTH}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-invalid={!draft.trim()}
          className="w-full bg-transparent px-2 py-1.5 text-[15px] focus:outline-none"
        />
        {!draft.trim() && (
          <p className="px-2 text-xs text-danger" role="alert">A task can't be empty.</p>
        )}

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
          <div className="flex gap-1" role="radiogroup" aria-label="Priority">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={draftPriority === p}
                onClick={() => setDraftPriority(p)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  draftPriority === p ? 'bg-ink text-white' : 'text-muted hover:bg-canvas'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${PRIORITY_STYLES[p]}`} aria-hidden="true" />
                {p}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={cancel}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!draft.trim()}
              className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </li>
    )
  }

  return (
    <li className="group animate-slide-in flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 shadow-sm ring-1 ring-line hover:ring-muted/40 transition-shadow">
      <input
        type="checkbox"
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-5 w-5 shrink-0 cursor-pointer accent-brand"
      />

      <label
        htmlFor={`todo-${todo.id}`}
        onDoubleClick={(e) => {
          e.preventDefault()
          startEditing()
        }}
        className={`flex-1 min-w-0 cursor-pointer break-words text-[15px] transition-colors ${
          todo.completed ? 'text-muted line-through' : ''
        }`}
      >
        {todo.text}
      </label>

      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${PRIORITY_STYLES[todo.priority]} ${todo.completed ? 'opacity-30' : ''}`}
        title={`${todo.priority} priority`}
      >
        <span className="sr-only">{todo.priority} priority</span>
      </span>

      <div className="flex shrink-0 gap-1 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
        <button
          ref={editButtonRef}
          type="button"
          onClick={startEditing}
          aria-label={`Edit "${todo.text}"`}
          className="rounded-lg p-2 text-muted hover:bg-canvas hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 20h4L19 9l-4-4L4 16v4z" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete "${todo.text}"`}
          className="rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-danger"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </li>
  )
}
