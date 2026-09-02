import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/Button'
import './AuthPages.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', username: '', fullName: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not create your account. Try different details.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card tf-card">
        <div className="auth-brand">
          <span className="auth-brand-mark">TF</span>
          <span>TaskFlow</span>
        </div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Set up projects and tasks for your team in minutes.</p>

        {error && <div className="tf-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="tf-field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              className="tf-input"
              value={form.fullName}
              onChange={update('fullName')}
              autoComplete="name"
            />
          </div>
          <div className="tf-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="tf-input"
              value={form.username}
              onChange={update('username')}
              required
              minLength={3}
              autoComplete="username"
            />
          </div>
          <div className="tf-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="tf-input"
              value={form.email}
              onChange={update('email')}
              required
              autoComplete="email"
            />
          </div>
          <div className="tf-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="tf-input"
              value={form.password}
              onChange={update('password')}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
            {submitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
