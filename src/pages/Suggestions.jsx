import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { isAuthenticated, getUser } from '../utils/auth'

export default function Suggestions() {
  const navigate = useNavigate()
  const [suggestion, setSuggestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  if (!isAuthenticated()) {
    navigate('/login', { replace: true })
    return null
  }

  const user = getUser()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!suggestion.trim()) return

    setLoading(true)
    setError('')
    try {
      const payload = {
        name: user?.name || "Anonymous User",
        email: user?.email || "unknown@unavoidable.app",
        suggestions: [suggestion]
      }

      const res = await fetch('http://localhost:8000/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to submit suggestion.')
      
      setSubmitted(true)
      setSuggestion('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <button className="back-link" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="page-header">
          <h1>💡 Suggest an Improvement</h1>
          <p>Help us make government processes easier. What would you like to see changed or added?</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          {submitted ? (
            <div className="alert alert-success">
              ✓ Thank you for your suggestion! We'll review it soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="suggestion">Your suggestion</label>
                <textarea
                  id="suggestion"
                  className="input"
                  placeholder="Describe what you'd like to improve..."
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="button button-primary button-full"
                disabled={loading || !suggestion.trim()}
              >
                {loading ? 'Submitting...' : 'Submit Suggestion'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}