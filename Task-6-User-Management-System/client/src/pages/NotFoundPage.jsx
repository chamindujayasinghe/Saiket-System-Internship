import { Link } from 'react-router'

export default function NotFoundPage({ title = 'Page not found', message = "The page you're looking for doesn't exist." }) {
  return (
    <div className="animate-fade-up py-20 text-center">
      <p className="font-mono text-sm text-brand">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted">{message}</p>
      <Link to="/" className="mt-8 inline-block rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
        Back to users
      </Link>
    </div>
  )
}
