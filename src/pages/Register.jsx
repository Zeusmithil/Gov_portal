import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiRegister } from '../services/api'
import { setToken, setUser, isAuthenticated } from '../utils/auth'

export default function Register() {
  const navigate = useNavigate()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  
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

    if (!name || !email || !password || !confirm) {
      setError('All fields are required.')
      return
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await apiRegister(name, email, password)
      setToken(res.token)
      setUser(res.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-sm">
      <div className="auth-header">
        <div className="auth-logo">G/</div>
        <h1>Create account</h1>
        <p>Start navigating government processes effortlessly</p>
      </div>

      <div className="card">
        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="input"
              placeholder="Priya Sharma"
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              autoComplete="name"
            />
          </div>

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
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              className="input"
              placeholder="Repeat password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError('') }}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="button button-primary button-full"
            disabled={loading}
          >
            {loading ? <><span className="spinner" /> Creating account...</> : 'Create account'}
          </button>
        </form>
      </div>

      <div className="auth-switch">
        Already have an account?{' '}
        <Link to="/login">Sign in →</Link>
      </div>
    </div>
  )
}
