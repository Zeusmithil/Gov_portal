import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiLogin } from '../services/api'
import { setToken, setUser, isAuthenticated } from '../utils/auth'

export default function Login() {
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('demo@example.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      const res = await apiLogin(email, password)
      setToken(res.token)
      setUser(res.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-sm">
      <div className="auth-header">
        <div className="auth-logo">G/</div>
        <h1>Welcome back</h1>
        <p>Sign in to navigate your government processes</p>
      </div>

      <div className="card">
        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              placeholder="Your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="button button-primary button-full"
            disabled={loading}
          >
            {loading ? <><span className="spinner" /> Signing in...</> : 'Sign in'}
          </button>
        </form>
      </div>

      <div className="auth-switch">
        Don't have an account?{' '}
        <Link to="/register">Create one →</Link>
      </div>
      <p className="auth-hint">Demo: prefilled credentials work instantly</p>
    </div>
  )
}
