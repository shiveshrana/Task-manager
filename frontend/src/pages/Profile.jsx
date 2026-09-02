import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { userService } from '../services/userService'
import Button from '../components/Button'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [username, setUsername] = useState(user?.username || '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      const updated = await userService.updateProfile({ full_name: fullName, username })
      setUser(updated)
      setSuccess('Profile updated.')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not update your profile.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="tf-page-header">
        <div>
          <h1 className="tf-page-title">Profile</h1>
          <p className="tf-page-subtitle">Manage how your name appears to your team.</p>
        </div>
      </div>

      <div className="tf-card" style={{ padding: 24, maxWidth: 420 }}>
        {error && <div className="tf-error">{error}</div>}
        {success && (
          <div
            style={{
              background: 'color-mix(in srgb, var(--tf-teal) 10%, white)',
              border: '1px solid color-mix(in srgb, var(--tf-teal) 30%, white)',
              color: 'var(--tf-teal)',
              padding: '10px 14px',
              borderRadius: 6,
              fontSize: 13.5,
              marginBottom: 16,
            }}
          >
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="tf-field">
            <label>Email</label>
            <input className="tf-input" value={user?.email || ''} disabled />
          </div>
          <div className="tf-field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              className="tf-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="tf-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              className="tf-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              required
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </div>
    </div>
  )
}
