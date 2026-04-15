import React, { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { apiRequestPasswordReset, apiExecutePasswordReset } from '../services/api'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleRequestSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)
    try {
      const res = await apiRequestPasswordReset(email)
      setMessage(res.message || 'If this email exists, a password reset link has been sent.')
      setEmail('')
    } catch (err) {
      setError(err.message || 'Unable to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setLoading(true)
    try {
      const res = await apiExecutePasswordReset(token, newPassword)
      setMessage(res.message || 'Your password has been reset successfully.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message || 'Unable to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isResetMode = Boolean(token)

  return (
    <>
      <Navbar />
      <div className="container-sm" style={{ paddingTop: '36px', paddingBottom: '64px' }}>
        <div className="auth-header">
          <div className="auth-logo">G/</div>
          <h1>{isResetMode ? 'Create a new password' : 'Reset your password'}</h1>
          <p>
            {isResetMode
              ? 'Enter a new password below to update your account.'
              : 'Enter your email and we’ll send you a link to change your password.'}
          </p>
        </div>

        <div className="card">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={isResetMode ? handleResetSubmit : handleRequestSubmit}>
            {isResetMode ? (
              <>
                <div className="form-group">
                  <label htmlFor="newPassword">New password</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="input"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="input"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </>
            ) : (
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            )}

            <button
              type="submit"
              className="button button-primary button-full"
              disabled={loading || (isResetMode ? !newPassword || !confirmPassword : !email.trim())}
            >
              {loading
                ? isResetMode
                  ? 'Resetting password...'
                  : 'Sending email...'
                : isResetMode
                ? 'Set new password'
                : 'Send reset link'}
            </button>
          </form>
        </div>

        <div className="auth-switch">
          {isResetMode ? (
            <>Already have access? <Link to="/login">Sign in</Link></>
          ) : (
            <>Remembered your password? <Link to="/login">Sign in</Link></>
          )}
        </div>

        <button className="button button-ghost" onClick={() => navigate(-1)}>
          ← Go back
        </button>
      </div>
    </>
  )
}
