import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { deleteUser, getErrorMessage, getUsers } from '../api/users'
import { useToast } from '../context/ToastContext'
import Avatar from '../components/Avatar'
import ConfirmDialog from '../components/ConfirmDialog'
import { EmptyState, ErrorState, Spinner } from '../components/States'
import { formatDate } from '../utils/format'
import { useFetch } from '../hooks/useFetch'

function RowActions({ user, onDelete }) {
  const base = 'rounded-lg p-2 text-muted transition-colors focus:outline-none focus-visible:ring-2'
  return (
    <div className="flex justify-end gap-1">
      <Link to={`/users/${user.id}`} className={`${base} hover:bg-page hover:text-ink focus-visible:ring-brand`} aria-label={`View ${user.name}`}>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
      </Link>
      <Link to={`/users/${user.id}/edit`} className={`${base} hover:bg-page hover:text-ink focus-visible:ring-brand`} aria-label={`Edit ${user.name}`}>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4z" strokeLinejoin="round" /></svg>
      </Link>
      <button type="button" onClick={() => onDelete(user)} className={`${base} hover:bg-danger/10 hover:text-danger focus-visible:ring-danger`} aria-label={`Delete ${user.name}`}>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  )
}

export default function UserListPage() {
  const showToast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [searchInput, setSearchInput] = useState(query)

  // Load users whenever the search changes (or "Try again" is pressed).
  const { data, error, loading, reload, setData: setUsers } = useFetch(
    (signal) => getUsers(query, { signal }),
    query
  )
  const users = data || []
  const status = loading ? 'loading' : error ? 'error' : 'ready'

  const [userToDelete, setUserToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Update the ?q= URL parameter 300ms after the user stops typing.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim() !== query) {
        setSearchParams(searchInput.trim() ? { q: searchInput.trim() } : {}, { replace: true })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, query, setSearchParams])

  async function handleConfirmDelete() {
    setDeleting(true)
    try {
      await deleteUser(userToDelete.id)
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id))
      showToast(`${userToDelete.name} was deleted`)
      setUserToDelete(null)
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
    } finally {
      setDeleting(false)
    }
  }

  const averageAge = users.length ? Math.round(users.reduce((sum, u) => sum + u.age, 0) / users.length) : 0

  return (
    <div className="animate-fade-up">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-muted">Create, view, update and delete user profiles stored in MySQL.</p>
        </div>

        <div className="relative sm:w-72">
          <label htmlFor="search" className="sr-only">Search users</label>
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            id="search"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name or email…"
            className="w-full rounded-xl border border-line bg-panel py-2.5 pl-9 pr-3 text-sm focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
          />
        </div>
      </div>

      {/* Stats */}
      {status === 'ready' && users.length > 0 && (
        <dl className="mb-6 grid grid-cols-2 sm:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
          <div className="bg-panel px-5 py-4">
            <dt className="text-xs text-muted">{query ? 'Matching users' : 'Total users'}</dt>
            <dd className="mt-1 text-2xl font-semibold">{users.length}</dd>
          </div>
          <div className="bg-panel px-5 py-4">
            <dt className="text-xs text-muted">Average age</dt>
            <dd className="mt-1 text-2xl font-semibold">{averageAge}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-panel px-5 py-4">
            <dt className="text-xs text-muted">Newest member</dt>
            <dd className="mt-1 truncate text-2xl font-semibold">{users[0].name.split(' ')[0]}</dd>
          </div>
        </dl>
      )}

      {/* Content */}
      {status === 'loading' && <Spinner label="Loading users…" />}

      {status === 'error' && <ErrorState message={getErrorMessage(error)} onRetry={reload} />}

      {status === 'ready' && users.length === 0 && (
        query ? (
          <EmptyState
            title="No matching users"
            description={`Nobody matches "${query}". Try a different name or email.`}
            action={<button type="button" onClick={() => setSearchInput('')} className="text-sm font-medium text-brand hover:underline">Clear search</button>}
          />
        ) : (
          <EmptyState
            title="No users yet"
            description="Create the first user profile to get started."
            action={<Link to="/users/new" className="inline-block rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Create user</Link>}
          />
        )
      )}

      {status === 'ready' && users.length > 0 && (
        <>
          {/* Table (tablet and up) */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-line bg-panel">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-page/60 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Name</th>
                  <th scope="col" className="px-5 py-3 font-medium">Email</th>
                  <th scope="col" className="px-5 py-3 font-medium">Age</th>
                  <th scope="col" className="px-5 py-3 font-medium">Joined</th>
                  <th scope="col" className="px-5 py-3 font-medium text-right"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-page/50 transition-colors">
                    <td className="px-5 py-3">
                      <Link to={`/users/${user.id}`} className="flex items-center gap-3 font-medium hover:text-brand">
                        <Avatar name={user.name} size="sm" />
                        {user.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted">{user.email}</td>
                    <td className="px-5 py-3 font-mono">{user.age}</td>
                    <td className="px-5 py-3 text-muted">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-2"><RowActions user={user} onDelete={setUserToDelete} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards (mobile) */}
          <ul className="md:hidden space-y-2">
            {users.map((user) => (
              <li key={user.id} className="flex items-center gap-3 rounded-2xl border border-line bg-panel p-4">
                <Avatar name={user.name} />
                <Link to={`/users/${user.id}`} className="min-w-0 flex-1">
                  <p className="truncate font-medium">{user.name}</p>
                  <p className="truncate text-sm text-muted">{user.email} · {user.age}</p>
                </Link>
                <RowActions user={user} onDelete={setUserToDelete} />
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="Delete this user?"
        message={userToDelete ? `${userToDelete.name}'s profile will be permanently removed from the database.` : ''}
        busy={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  )
}
