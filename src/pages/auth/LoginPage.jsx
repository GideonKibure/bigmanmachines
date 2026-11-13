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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Karakana</p>
        <h1 className="mt-2 font-display text-4xl uppercase">Ingia</h1>
        <p className="mt-2 text-sm text-muted">Wasimamizi na wafanyakazi wanatumia akaunti iliyotengenezwa kwenye Supabase.</p>
        {!configured && (
          <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Ongeza VITE_SUPABASE_URL na VITE_SUPABASE_ANON_KEY kwenye .env.local, kisha anzisha upya programu.
          </p>
        )}
        <div className="mt-5 space-y-4">
          <Field label="Barua pepe">
            <input className={inputClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </Field>
          <Field label="Nenosiri">
            <input className={inputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </Field>
          <Button type="submit" disabled={busy || !configured} className="w-full">
            {busy ? 'Inaingia…' : 'Ingia'}
          </Button>
        </div>
        <Link to="/" className="mt-4 inline-block text-sm text-muted hover:text-ink">Rudi kwenye tovuti</Link>
      </form>
    </div>
  )
}
