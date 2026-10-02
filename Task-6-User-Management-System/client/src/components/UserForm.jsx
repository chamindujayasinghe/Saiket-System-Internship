import { useState } from 'react'
import { Link } from 'react-router'
import { getErrorMessage, getFieldErrors } from '../api/users'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Same rules as the API, so most mistakes are caught before a request is sent.
function validate({ name, email, age }) {
  const errors = {}
  const trimmedName = name.trim()
  if (!trimmedName) errors.name = 'Name is required.'
  else if (trimmedName.length < 2 || trimmedName.length > 100) errors.name = 'Name must be 2–100 characters.'

  if (!email.trim()) errors.email = 'Email is required.'
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email, e.g. name@example.com.'

  const ageNumber = Number(age)
  if (age === '') errors.age = 'Age is required.'
  else if (!Number.isInteger(ageNumber) || ageNumber < 1 || ageNumber > 150) errors.age = 'Age must be a whole number from 1 to 150.'

  return errors
}

function Field({ id, label, error, hint, className = '', ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={`${id}-message`}
        className={`w-full rounded-xl border bg-panel px-3.5 py-2.5 text-[15px] transition-colors focus:outline-none focus:ring-4 ${className} ${
          error ? 'border-danger focus:ring-danger/15' : 'border-line focus:border-brand focus:ring-brand/15'
        }`}
        {...inputProps}
      />
      <p id={`${id}-message`} className={`mt-1.5 text-xs ${error ? 'text-danger' : 'text-muted'}`}>
        {error || hint}
      </p>
    </div>
  )
}

/**
 * Shared create / edit form.
 * onSubmit receives { name, email, age } and should return a promise.
 */
export default function UserForm({ initialValues, submitLabel, cancelTo, onSubmit }) {
  const [values, setValues] = useState({
    name: initialValues?.name ?? '',
    email: initialValues?.email ?? '',
    age: initialValues?.age != null ? String(initialValues.age) : '',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    const clientErrors = validate(values)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length > 0) {
      document.getElementById(Object.keys(clientErrors)[0])?.focus()
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({ name: values.name.trim(), email: values.email.trim(), age: Number(values.age) })
    } catch (error) {
      const fieldErrors = getFieldErrors(error)
      if (Object.keys(fieldErrors).length > 0) setErrors(fieldErrors)
      else setFormError(getErrorMessage(error))
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError && (
        <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger" role="alert">
          {formError}
        </div>
      )}

      <Field id="name" label="Full name" value={values.name} onChange={handleChange} error={errors.name}
        hint="2–100 characters." placeholder="e.g. Amaya Perera" autoComplete="name" maxLength={100} />

      <Field id="email" label="Email" type="email" value={values.email} onChange={handleChange} error={errors.email}
        hint="Must be unique." placeholder="name@example.com" autoComplete="email" />

      <Field id="age" label="Age" type="number" inputMode="numeric" min={1} max={150} value={values.age}
        onChange={handleChange} error={errors.age} hint="Whole number, 1–150." className="sm:max-w-40" />

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 border-t border-line pt-5">
        <Link to={cancelTo} className="rounded-lg border border-line px-4 py-2.5 text-center text-sm font-medium hover:border-ink transition-colors">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
