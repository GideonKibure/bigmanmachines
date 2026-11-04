import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'
import Field, { inputClass } from '../../components/common/Field'
import { useAuth } from '../../contexts/AuthContext'
import { errorText } from '../../utils/format'

export default function LoginPage() {
  const { configured, session, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to="/admin" replace />

  async function onSubmit(event) {
    event.preventDefault()
    setBusy(true)
    try {
      await signIn(email.trim(), password)
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-line bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Workshop</p>
        <h1 className="mt-2 font-display text-4xl uppercase">Sign in</h1>
        <p className="mt-2 text-sm text-muted">Administrators and employees use the account created in Supabase.</p>
        {!configured && (
          <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local, then restart the app.
          </p>
        )}
        <div className="mt-5 space-y-4">
          <Field label="Email">
            <input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </Field>
          <Field label="Password">
            <input className={inputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </Field>
          <Button type="submit" disabled={busy || !configured} className="w-full">
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </div>
        <Link to="/" className="mt-4 inline-block text-sm text-muted hover:text-ink">Back to the website</Link>
      </form>
    </div>
  )
}
