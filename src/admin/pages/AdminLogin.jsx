import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAdminToken, setAdminUser } from '../utils/adminAuth.js'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Enter username and password')
      return
    }

    setLoading(true)
    try {
      // Call backend admin login endpoint
      const res = await fetch('http://localhost:8000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      
      if (!res.ok) throw new Error('Invalid credentials')
      
      const data = await res.json()
      setAdminToken(data.token)
      setAdminUser(data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-sm" style={{ paddingTop: '80px' }}>
      <div className="auth-header">
        <h1>🔐 Admin Login</h1>
        <p>Admin access only</p>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>

          <button
            type="submit"
            className="button button-primary button-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}