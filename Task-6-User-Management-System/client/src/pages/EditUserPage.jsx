import { Link, useNavigate, useParams } from 'react-router'
import { getErrorMessage, getUser, updateUser } from '../api/users'
import { useToast } from '../context/ToastContext'
import UserForm from '../components/UserForm'
import { ErrorState, Spinner } from '../components/States'
import NotFoundPage from './NotFoundPage'
import { useFetch } from '../hooks/useFetch'

export default function EditUserPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const showToast = useToast()

  // Load the current values to pre-fill the form.
  const { data: user, error, loading, reload } = useFetch((signal) => getUser(id, { signal }), id)

  async function handleSubmit(values) {
    const updated = await updateUser(id, values)
    showToast(`${updated.name} was updated`)
    navigate(`/users/${id}`)
  }

  if (loading) return <Spinner label="Loading profile…" />
  if ([400, 404].includes(error?.response?.status)) {
    return <NotFoundPage title="User not found" message={`There is no user with id "${id}".`} />
  }
  if (error) return <ErrorState message={getErrorMessage(error)} onRetry={reload} />

  return (
    <div className="animate-fade-up mx-auto max-w-xl">
      <Link to={`/users/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-6">
        <span aria-hidden="true">←</span> Back to profile
      </Link>
      <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Edit profile</h1>
        <p className="mt-1 mb-8 text-sm text-muted">Update {user.name}'s details.</p>
        <UserForm initialValues={user} submitLabel="Save changes" cancelTo={`/users/${id}`} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
