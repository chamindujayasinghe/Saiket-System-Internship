import { Link, useNavigate } from 'react-router'
import { createUser } from '../api/users'
import { useToast } from '../context/ToastContext'
import UserForm from '../components/UserForm'

export default function CreateUserPage() {
  const navigate = useNavigate()
  const showToast = useToast()

  async function handleSubmit(values) {
    const user = await createUser(values)
    showToast(`${user.name} was created`)
    navigate(`/users/${user.id}`)
  }

  return (
    <div className="animate-fade-up mx-auto max-w-xl">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-6">
        <span aria-hidden="true">←</span> All users
      </Link>
      <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Create user</h1>
        <p className="mt-1 mb-8 text-sm text-muted">Add a new profile to the database.</p>
        <UserForm submitLabel="Create user" cancelTo="/" onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
