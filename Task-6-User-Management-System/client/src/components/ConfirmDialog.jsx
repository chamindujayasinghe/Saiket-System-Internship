import { useEffect, useRef } from 'react'

// Modal confirmation built on the native <dialog> element,
// which handles focus trapping and the Escape key for us.
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', busy, onConfirm, onCancel }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault()
        if (!busy) onCancel()
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current && !busy) onCancel() // click on the backdrop
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-panel p-0 shadow-2xl"
      aria-labelledby="confirm-title"
    >
      <div className="p-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-danger/10 text-danger">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 id="confirm-title" className="text-lg font-semibold">{title}</h2>
        <p className="mt-1.5 text-sm text-muted">{message}</p>
      </div>
      <div className="flex justify-end gap-2 border-t border-line bg-page/60 px-6 py-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          autoFocus
          className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium hover:border-ink disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
        >
          {busy ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
