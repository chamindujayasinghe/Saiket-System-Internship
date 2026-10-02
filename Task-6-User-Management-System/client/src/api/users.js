import axios from 'axios'

// All requests go to /api; Vite proxies them to the Express server in development.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

export async function getUsers(search = '', { signal } = {}) {
  const { data } = await api.get('/users', { params: search ? { search } : {}, signal })
  return data
}

export async function getUser(id, { signal } = {}) {
  const { data } = await api.get(`/users/${id}`, { signal })
  return data
}

export async function createUser(user) {
  const { data } = await api.post('/users', user)
  return data
}

export async function updateUser(id, user) {
  const { data } = await api.put(`/users/${id}`, user)
  return data
}

export async function deleteUser(id) {
  await api.delete(`/users/${id}`)
}

// Turns any request error into a short, readable message.
export function getErrorMessage(error) {
  if (!error.response) return 'Cannot reach the server. Is the API running on port 3000?'
  return error.response.data?.error || `Request failed (${error.response.status})`
}

// Maps the API's validation errors (e.g. "email must be ...") to form fields.
export function getFieldErrors(error) {
  const fieldErrors = {}
  const { status, data } = error.response || {}

  if (status === 409) fieldErrors.email = data.error
  for (const detail of data?.details || []) {
    const field = detail.split(' ')[0]
    if (['name', 'email', 'age'].includes(field)) fieldErrors[field] ??= detail
  }
  return fieldErrors
}
