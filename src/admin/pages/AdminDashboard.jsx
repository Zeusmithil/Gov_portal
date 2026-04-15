import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminUser, adminLogout } from '../utils/adminAuth.js'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const user = getAdminUser()

  function handleLogout() {
    adminLogout()
    navigate('/login')
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>Admin Dashboard</h1>
        <button className="button button-ghost" onClick={handleLogout}>Logout</button>
      </div>

      <div className="services-grid">
        <div className="card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => navigate('/users')}>
          <h3>👥 Manage steps</h3>
          <p>View and manage all changes here</p>
        </div>

        <div className="card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => navigate('/suggestions')}>
          <h3>💡 User Suggestions</h3>
          <p>Review and respond to user feedback</p>
        </div>

        <div className="card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => navigate('/services')}>
          <h3>⚙️ Manage Services</h3>
          <p>View, edit, and create main application services and steps</p>
        </div>
      </div>
    </div>
  )
}
