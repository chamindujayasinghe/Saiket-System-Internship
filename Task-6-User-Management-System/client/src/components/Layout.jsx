import { Link, NavLink, Outlet } from 'react-router'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-panel/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="" className="h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight">Roster</span>
            <span className="hidden sm:inline font-mono text-xs text-muted border border-line rounded px-1.5 py-0.5">
              user management
            </span>
          </Link>

          <nav className="flex items-center gap-1 text-sm font-medium" aria-label="Main">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 transition-colors ${isActive ? 'bg-page text-ink' : 'text-muted hover:text-ink'}`
              }
            >
              Users
            </NavLink>
            <Link
              to="/users/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-white hover:bg-brand-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              <span>New user</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <Outlet />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted">
          <p>React · Express · MySQL</p>
          <p>
            Built by{' '}
            <a href="https://github.com/chamindujayasinghe" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand">
              Chamindu Jayasinghe
            </a>{' '}
            · SaiKet Systems Internship · Task 06
          </p>
        </div>
      </footer>
    </div>
  )
}
