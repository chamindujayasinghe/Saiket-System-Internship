import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { deleteUser, getErrorMessage, getUser } from '../api/users'
import { useToast } from '../context/ToastContext'
import Avatar from '../components/Avatar'
import ConfirmDialog from '../components/ConfirmDialog'
import { ErrorState, Spinner } from '../components/States'
import { formatDateTime } from '../utils/format'
import NotFoundPage from './NotFoundPage'
import { useFetch } from '../hooks/useFetch'

export default function UserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const showToast = useToast()

  const { data: user, error, loading, reload } = useFetch((signal) => getUser(id, { signal }), id)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteUser(user.id)
      showToast(`${user.name} was deleted`)
      navigate('/', { replace: true })
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  if (loading) return <Spinner label="Loading profile…" />
  if ([400, 404].includes(error?.response?.status)) {
    return <NotFoundPage title="User not found" message={`There is no user with id "${id}". They may have been deleted.`} />
  }
  if (error) return <ErrorState message={getErrorMessage(error)} onRetry={reload} />

  const details = [
    { label: 'Email', value: <a href={`mailto:${user.email}`} className="hover:text-brand hover:underline">{user.email}</a> },
    { label: 'Age', value: `${user.age} years` },
    { label: 'User ID', value: <span className="font-mono">#{user.id}</span> },
    { label: 'Created', value: formatDateTime(user.createdAt) },
    { label: 'Last updated', value: user.updatedAt ? formatDateTime(user.updatedAt) : 'Never' },
  ]

  return (
    <div className="animate-fade-up mx-auto max-w-2xl">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-6">
        <span aria-hidden="true">←</span> All users
      </Link>

      <article className="overflow-hidden rounded-2xl border border-line bg-panel">
        <div className="h-24 bg-gradient-to-r from-brand-soft to-page" aria-hidden="true" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="rounded-full ring-4 ring-panel"><Avatar name={user.name} size="lg" /></div>
              <div className="pb-1">
                <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
                <p className="text-sm text-muted">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/users/${user.id}/edit`} className="flex-1 sm:flex-none rounded-lg bg-brand px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-dark transition-colors">
                Edit profile
              </Link>
              <button type="button" onClick={() => setConfirmOpen(true)} className="flex-1 sm:flex-none rounded-lg border border-line px-4 py-2 text-sm font-medium text-danger hover:border-danger hover:bg-danger/5 transition-colors">
                Delete
              </button>
            </div>
          </div>

          <dl className="mt-8 divide-y divide-line border-t border-line">
            {details.map(({ label, value }) => (
              <div key={label} className="grid grid-cols-3 gap-4 py-3.5 text-sm">
                <dt className="text-muted">{label}</dt>
                <dd className="col-span-2 break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this user?"
        message={`${user.name}'s profile will be permanently removed from the database.`}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
