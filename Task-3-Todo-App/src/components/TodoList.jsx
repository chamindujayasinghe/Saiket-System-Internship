import TodoItem from './TodoItem'

const EMPTY_MESSAGES = {
  all: { title: 'Nothing on your list', body: 'Add your first task above to get started.' },
  active: { title: 'All done!', body: 'You have no active tasks. Enjoy the free time.' },
  completed: { title: 'No completed tasks yet', body: 'Tick a task off and it will show up here.' },
}

export default function TodoList({ todos, filter, onToggle, onUpdate, onDelete }) {
  if (todos.length === 0) {
    const message = EMPTY_MESSAGES[filter]
    return (
      <div className="rounded-2xl border-2 border-dashed border-line px-6 py-14 text-center">
        <p className="font-display text-xl font-bold">{message.title}</p>
        <p className="mt-1 text-sm text-muted">{message.body}</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2" aria-label="Tasks">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

