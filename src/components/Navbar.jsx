import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, logout } from '../utils/auth'

export default function Navbar() {
  const navigate = useNavigate()
  const user = getUser()
  const initial = user?.name?.[0]?.toUpperCase() || 'U'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
        <div className="navbar-logo">G/</div>
        Gov Services Portal
      </div>
      <div className="navbar-right">
        {user && (
          <div className="navbar-user">
            <div className="avatar">{initial}</div>
            <span>{user.name}</span>
          </div>
        )}
        <button className="button button-secondary" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </nav>
  )
}
