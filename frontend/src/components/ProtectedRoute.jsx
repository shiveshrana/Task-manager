import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AppShell from './AppShell'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--tf-slate)', fontSize: 14 }}>Loading TaskFlow…</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <AppShell>{children}</AppShell>
}
