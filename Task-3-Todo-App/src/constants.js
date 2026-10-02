export const MAX_LENGTH = 120

export const PRIORITIES = ['high', 'medium', 'low']

export const FILTERS = {
  all: () => true,
  active: (todo) => !todo.completed,
  completed: (todo) => todo.completed,
}
