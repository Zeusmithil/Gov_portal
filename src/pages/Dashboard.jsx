import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ServiceCard from '../components/ServiceCard'
import { getServices } from '../services/api'
import { getUser, isAuthenticated } from '../utils/auth'

function getInitialActivity() {
  try {
    return JSON.parse(sessionStorage.getItem('activity') || '[]')
  } catch {
    return []
  }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = getUser()
  const [activity, setActivity] = useState(getInitialActivity())

  const [services, setServices] = useState([])

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true })
    } else {
      async function loadData() {
        const data = await getServices()
        setServices(data)
      }
      loadData()
    }
  }, [navigate])
  useEffect(() => {
    const handleFocus = () => {
      const data = JSON.parse(sessionStorage.getItem('activity') || '[]')
      setActivity(data)
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const greeting = getGreeting()

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>{greeting}, {user?.name || 'there'} 👋</h1>
          <p>Select a government service to get started with step-by-step guidance.</p>
        </div>

        {/* Services grid */}
        <div className="services-grid">
          {services.map((svc) => (
            <ServiceCard key={svc.id} service={svc} />
          ))}
        </div>

        <div className="divider" />

        {/* Recent activity */}
        <div className="flex-between mt-4">
          <div className="section-title" style={{ marginBottom: 0 }}>
            Recent activity
          </div>
          {activity.length > 0 && (
            <button
              className="button button-ghost"
              style={{ fontSize: '13px', padding: '6px 12px' }}
              onClick={() => {
                sessionStorage.removeItem('activity')
                setActivity([])
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ marginTop: '16px' }}>
          {activity.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px' }}>
              <p>Your activity will appear here after you interact with a service.</p>
            </div>
          ) : (
            [...activity].reverse().slice(0, 6).map((item, i) => (
              <div key={i} className="activity-card">
                <span className="activity-icon">{item.icon}</span>
                <div className="activity-info">
                  <div>{item.title}</div>
                  <span>{item.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
