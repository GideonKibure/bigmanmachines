import { Navigate } from 'react-router-dom'
import { FullPageSpinner } from '../components/common/Spinner'
import { useAuth } from '../contexts/AuthContext'

export function RequireAuth({ children }) {
  const { session, loading, configured } = useAuth()
  if (!configured) return <Navigate to="/login" replace />
  if (loading) return <FullPageSpinner />
  if (!session) return <Navigate to="/login" replace />
  return children
}

export function RequireAdmin({ children }) {
  const { role, loading, profile } = useAuth()
  if (loading) return <FullPageSpinner />
  if (!profile || role !== 'admin') return <Navigate to="/admin" replace />
  return children
}
