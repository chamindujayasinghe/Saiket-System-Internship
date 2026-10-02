import { FILTERS } from '../constants'

export default function FilterBar({ filter, onFilterChange, counts, onClearCompleted }) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="inline-flex rounded-xl bg-card p-1 ring-1 ring-line" role="group" aria-label="Filter tasks">
        {Object.keys(FILTERS).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onFilterChange(name)}
            aria-pressed={filter === name}
            className={`flex-1 sm:flex-none rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === name ? 'bg-ink text-white' : 'text-muted hover:text-ink'
            }`}
          >
            {name}
            <span className={`ml-1.5 text-xs ${filter === name ? 'text-white/60' : 'text-muted/70'}`}>
              {counts[name]}
            </span>
          </button>
        ))}
      </div>

      {counts.completed > 0 && (
        <button
          type="button"
          onClick={onClearCompleted}
          className="self-end sm:self-auto text-sm font-medium text-muted hover:text-danger transition-colors"
        >
          Clear completed
        </button>
      )}
    </div>
  )
}
