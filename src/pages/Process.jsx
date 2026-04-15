import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import StepList from '../components/StepList'
import { getService } from '../services/api'
import { isAuthenticated } from '../utils/auth'

function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.type === 'success' ? '✓' : t.type === 'error' ? '✗' : '●'} {t.msg}
        </div>
      ))}
    </div>
  )
}

export default function Process() {
  const { service } = useParams()
  const navigate = useNavigate()

  const [svcData, setSvcData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Toasts
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true })
      return
    }

    async function loadService() {
      setLoading(true)
      const data = await getService(service)
      if (!data) {
        navigate('/dashboard')
        return
      }
      setSvcData(data)
      setLoading(false)
    }
    
    loadService()
  }, [service, navigate])

  // Call logActivity after svcData is set
  useEffect(() => {
    if (svcData) {
      logActivity('Opened ' + svcData.title, svcData.icon || '📋')
    }
  }, [svcData])

  function showToast(msg, type = '') {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, msg, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200)
  }

  function logActivity(title, icon = '📋') {
    const entry = { title, icon, time: new Date().toLocaleTimeString() }
    const prev = JSON.parse(sessionStorage.getItem('activity') || '[]')

    // prevent duplicate (same last action)
    if (prev.length > 0 && prev[prev.length - 1].title === title) {
      return
    }

    const updated = [...prev, entry].slice(-10) // keep only last 10
    sessionStorage.setItem('activity', JSON.stringify(updated))
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ textAlign: 'center', paddingTop: '80px' }}>
          <span className="spinner spinner-dark" style={{ width: 28, height: 28 }} />
          <p className="text-muted mt-4">Loading service...</p>
        </div>
      </>
    )
  }

  if (!svcData) return null

  return (
    <>
      <Navbar />
      <Toast toasts={toasts} />

      <div className="container">
        {/* Back link */}
        <button className="back-link" onClick={() => navigate('/dashboard')}>
          ← Back to dashboard
        </button>

        {/* Process header */}
        <div className="process-header">
          <div>
            <h1>{svcData.title}</h1>
            <p>{svcData.subtitle}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span className="badge">⏱ {svcData.time}</span>
            <span className="badge">💰 {svcData.fee}</span>
          </div>
        </div>

        <div className="process-layout">
            <div>
              <div className="section-title">Services</div>
              {service !== 'aadhaar' && service !== 'driving' && service !== 'passport' && service !== 'patta-document' && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  <StepList steps={svcData.steps} />
                  {svcData.portalLink && (
                    <div style={{ marginTop: '8px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#343a40' }}>Ready to apply?</h4>
                      <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6c757d' }}>Visit the official portal to start your application process.</p>
                      <a
                        href={svcData.portalLink}
                        target="_blank"
                        rel="noreferrer"
                        className="button button-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                      >
                        Go to {svcData.portalName || 'Portal'}
                        <span style={{ fontSize: '16px' }}>↗</span>
                      </a>
                    </div>
                  )}
                </div>

)}

              {service === 'aadhaar' && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "18px", marginBottom: "4px" }}>Aadhaar Services</h3>

                  {/* Update Aadhaar Card */}
                  <div
                    className="card"
                    style={{ padding: "20px", cursor: "pointer" }}
                    onClick={() => navigate("/update-aadhaar")}
                  >
                    <h3 style={{ marginBottom: "6px" }}>Update Aadhaar</h3>
                    <p className="text-muted" style={{ fontSize: "14px" }}>Modify your Aadhaar details like address, mobile, etc.</p>
                  </div>

                  {/* Get Aadhaar Card */}
                  <div
                    className="card"
                    style={{ padding: "20px", cursor: "pointer" }}
                    onClick={() => navigate("/get-aadhaar")}
                  >
                    <h3 style={{ marginBottom: "6px" }}>Get Aadhaar</h3>
                    <p className="text-muted" style={{ fontSize: "14px" }}>Download or retrieve your Aadhaar details.</p>
                  </div>

                  {svcData.portalLink && (
                    <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#343a40' }}>Ready to apply?</h4>
                      <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6c757d' }}>Visit the official portal to start your application process.</p>
                      <a
                        href={svcData.portalLink}
                        target="_blank"
                        rel="noreferrer"
                        className="button button-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                      >
                        Go to {svcData.portalName || 'Portal'}
                        <span style={{ fontSize: '16px' }}>↗</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {service === 'driving' && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "18px", marginBottom: "4px" }}>Driving License Services</h3>

                  <div
                    className="card"
                    style={{ padding: "20px", cursor: "pointer" }}
                    onClick={() => navigate("/online-test")}
                  >
                    <h3 style={{ marginBottom: "6px" }}>Online Test / Appointment</h3>
                    <p className="text-muted" style={{ fontSize: "14px" }}>Book a slot or take your learner's license test online.</p>
                  </div>

                  <div
                    className="card"
                    style={{ padding: "20px", cursor: "pointer" }}
                    onClick={() => navigate("/learners-license")}
                  >
                    <h3 style={{ marginBottom: "6px" }}>Driver's / Learner's License</h3>
                    <p className="text-muted" style={{ fontSize: "14px" }}>Apply for a new Learner's License or permanent Driving License.</p>
                  </div>

                  <div
                    className="card"
                    style={{ padding: "20px", cursor: "pointer" }}
                    onClick={() => navigate("/driving-school")}
                  >
                    <h3 style={{ marginBottom: "6px" }}>Driving School</h3>
                    <p className="text-muted" style={{ fontSize: "14px" }}>Register with recognized driving schools for formal training.</p>
                  </div>

                  <div
                    className="card"
                    style={{ padding: "20px", cursor: "pointer" }}
                    onClick={() => navigate("/other-services")}
                  >
                    <h3 style={{ marginBottom: "6px" }}>Other Services</h3>
                    <p className="text-muted" style={{ fontSize: "14px" }}>Duplicate license, address change, and general applications.</p>
                  </div>

                  {svcData.portalLink && (
                    <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#343a40' }}>Ready to apply?</h4>
                      <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6c757d' }}>Visit the official portal to start your application process.</p>
                      <a
                        href={svcData.portalLink}
                        target="_blank"
                        rel="noreferrer"
                        className="button button-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                      >
                        Go to {svcData.portalName || 'Portal'}
                        <span style={{ fontSize: '16px' }}>↗</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
              {service === 'passport' && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "18px", marginBottom: "4px" }}>Passport Services</h3>
                  <p className="text-muted" style={{ fontSize: "14px" }}>Apply for a new passport or renew an existing one.</p>

                  <div
                    className="card"
                    style={{ padding: "20px", cursor: "pointer" }}
                    onClick={() => navigate("/new-passport")}
                  >
                    <h3 style={{ marginBottom: "6px" }}>New Passport</h3>
                    <p className="text-muted" style={{ fontSize: "14px" }}>Apply for a fresh passport booklet.</p>
                  </div>

                  <div
                    className="card"
                    style={{ padding: "20px", cursor: "pointer" }}
                    onClick={() => navigate("/passport-renewal")}
                  >
                    <h3 style={{ marginBottom: "6px" }}>Passport Renewal</h3>
                    <p className="text-muted" style={{ fontSize: "14px" }}>Renew your expiring or expired passport.</p>
                  </div>

                  <div
                    className="card"
                    style={{ padding: "20px", cursor: "pointer" }}
                    onClick={() => navigate("/lost-damage")}
                  >
                    <h3 style={{ marginBottom: "6px" }}>Lost/Damaged Passport</h3>
                    <p className="text-muted" style={{ fontSize: "14px" }}>Apply for a replacement in case of loss or damage.</p>
                  </div>

                  <div
                    className="card"
                    style={{ padding: "20px", cursor: "pointer" }}
                    onClick={() => navigate("/other-passport-services")}
                  >
                    <h3 style={{ marginBottom: "6px" }}>Other Services</h3>
                    <p className="text-muted" style={{ fontSize: "14px" }}>Police Clearance Certificate (PCC) and other passport-related services.</p>
                  </div>

                  {svcData.portalLink && (
                    <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#343a40' }}>Ready to apply?</h4>
                      <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6c757d' }}>Visit the official portal to start your application process.</p>
                      <a
                        href={svcData.portalLink}
                        target="_blank"
                        rel="noreferrer"
                        className="button button-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                      >
                        Go to {svcData.portalName || 'Portal'}
                        <span style={{ fontSize: '16px' }}>↗</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
              {service === 'patta-document' && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "18px", marginBottom: "4px" }}>Patta Document Services</h3>
                  <div
                    className="card"
                    style={{ padding: "20px", cursor: "pointer" }}
                    onClick={() => navigate("/new-patta")}
                  >
                    <h3 style={{ marginBottom: "6px" }}>New Patta</h3>
                    <p className="text-muted" style={{ fontSize: "14px" }}>Apply for a new patta document.</p>
                  </div>
                  <div
                    className="card"
                    style={{ padding: "20px", cursor: "pointer" }}
                    onClick={() => navigate("/patta-name-transfer")}
                  >
                    <h3 style={{ marginBottom: "6px" }}>Patta Name Transfer</h3>
                    <p className="text-muted" style={{ fontSize: "14px" }}>Transfer patta name to new owner.</p>
                  </div>

                  {svcData.portalLink && (
                    <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#343a40' }}>Ready to apply?</h4>
                      <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6c757d' }}>Visit the official portal to start your application process.</p>
                      <a
                        href={svcData.portalLink}
                        target="_blank"
                        rel="noreferrer"
                        className="button button-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                      >
                        Go to {svcData.portalName || 'Portal'}
                        <span style={{ fontSize: '16px' }}>↗</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
          
            
            </div>
            
            <div>
              {svcData.docs && svcData.docs.map((doc, i) => (
                <div key={i} className="doc-req">
                  <div className="doc-req-info">
                    <h5>{doc.name}</h5>
                    <span>{doc.format} · {doc.size}</span>
                  </div>
                  <span className="doc-badge">{doc.format.split('/')[0]}</span>
                </div>
              ))}

              <button
                className="button button-secondary"
                onClick={() => navigate('/suggestions')}
                style={{ marginTop: '16px' }}
              >
                💡 Suggest an improvement
              </button>
            </div>
          </div>
        

      </div>
    </>
  )
}
