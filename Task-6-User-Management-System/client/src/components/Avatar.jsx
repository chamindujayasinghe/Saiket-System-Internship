const COLORS = [
  'bg-teal-100 text-teal-800',
  'bg-amber-100 text-amber-800',
  'bg-rose-100 text-rose-800',
  'bg-sky-100 text-sky-800',
  'bg-violet-100 text-violet-800',
  'bg-lime-100 text-lime-800',
]

const SIZES = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-20 w-20 text-2xl',
}

// Initials avatar with a colour picked from the name, so each user keeps the same colour.
export default function Avatar({ name, size = 'md' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0)

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${SIZES[size]} ${COLORS[hash % COLORS.length]}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}
