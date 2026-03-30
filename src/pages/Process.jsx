import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import StepList from '../components/StepList'
import DocumentUpload from '../components/DocumentUpload'
import DocumentList from '../components/DocumentList'
import DocumentStatus from '../components/DocumentStatus'
import { getService, apiValidate, apiUpload } from '../services/api'
import { isAuthenticated } from '../utils/auth'


const TABS = ['steps', 'documents', 'vault']
const TAB_LABELS = { steps: 'Steps', documents: 'Validate Docs', vault: 'My Vault' }

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

function getInitialVault() {
  try {
    return JSON.parse(sessionStorage.getItem('vault') || '[]')
  } catch {
    return []
  }
}

export default function Process() {
  const { service } = useParams()
  const navigate = useNavigate()

  const [svcData, setSvcData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('steps')

  // Vault state
  const [vault, setVault] = useState(getInitialVault())

  // Validation state
  const [validating, setValidating] = useState(false)
  const [validResult, setValidResult] = useState(null)
  const [validFileName, setValidFileName] = useState('')

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
      // Call logActivity below
    }
    
    loadService()
  }, [service, navigate])

  // Call logActivity after svcData is set
  useEffect(() => {
    if (svcData) {
      logActivity('Opened ' + svcData.title, svcData.icon || '📋')
    }
  }, [svcData])

  // Persist vault
  useEffect(() => {
    sessionStorage.setItem('vault', JSON.stringify(vault))
  }, [vault])

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

  // --- Validation tab ---
  async function handleValidationFile(file) {
    setValidating(true)
    setValidResult(null)
    setValidFileName(file.name)
    try {
      await apiUpload(file)
      const result = await apiValidate(file)
      setValidResult(result)
      logActivity('Validated: ' + file.name, '🔍')
    } catch {
      showToast('Validation failed. Please try again.', 'error')
    } finally {
      setValidating(false)
    }
  }

  function handleAddToVaultFromValidation() {
    if (!validResult || !validFileName) return
    addToVault(validFileName, validFileName.split('.').pop().toUpperCase(), validResult.sizeKB + ' KB')
    setActiveTab('vault')
    showToast('Document added to vault!', 'success')
  }

  // --- Vault tab ---
  async function handleVaultUpload(file) {
    try {
      await apiUpload(file)
      const ext = file.name.split('.').pop().toUpperCase()
      const size = (file.size / 1024).toFixed(1) + ' KB'
      addToVault(file.name, ext, size)
      showToast('Document uploaded!', 'success')
      logActivity('Uploaded: ' + file.name, '📤')
    } catch {
      showToast('Upload failed. Please try again.', 'error')
    }
  }

  function addToVault(name, ext, size) {
    setVault((prev) => [
      ...prev,
      { id: Date.now(), name, ext, size, date: new Date().toLocaleDateString() },
    ])
  }

  function removeFromVault(id) {
    setVault((prev) => prev.filter((d) => d.id !== id))
    showToast('Document removed.')
  }

  function validateFromVault(doc) {
    setValidFileName(doc.name)
    setValidResult({
      sizeValid: parseFloat(doc.size) <= 2048,
      formatValid: ['PDF', 'JPG', 'JPEG', 'PNG'].includes(doc.ext),
      sizeKB: parseFloat(doc.size).toFixed(1),
      format: doc.ext,
    })
    setActiveTab('documents')
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

        {/* Tabs */}
        <div className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* ===== TAB: STEPS ===== */}
        {activeTab === 'steps' && (
          <div className="process-layout">
            <div>
              <div className="section-title">Services</div>
              {service !== 'aadhaar' && service !== 'driving' && <StepList steps={svcData.steps} />}

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


            </div>
            <div>
              <div className="section-title">Required documents</div>
              {svcData.docs && svcData.docs.map((doc, i) => (
                <div key={i} className="doc-req">
                  <div className="doc-req-info">
                    <h5>{doc.name}</h5>
                    <span>{doc.format} · {doc.size}</span>
                  </div>
                  <span className="doc-badge">{doc.format.split('/')[0]}</span>
                </div>
              ))}
              <div className="mt-4">
                <button
                  className="button button-primary"
                  onClick={() => setActiveTab('vault')}
                >
                  Upload documents →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB: VALIDATE DOCS ===== */}
        {activeTab === 'documents' && (
          <div style={{ maxWidth: '560px' }}>
            <div className="section-title">Upload &amp; validate</div>
            <div className="alert alert-info">
              Upload a document to check if it meets the size and format requirements for this service.
            </div>

            {!validating ? (
              <DocumentUpload onFile={handleValidationFile} />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <span className="spinner spinner-dark" style={{ width: 24, height: 24 }} />
                <p className="text-muted mt-3" style={{ fontSize: '14px' }}>Analysing document...</p>
              </div>
            )}

            <DocumentStatus
              validation={validResult}
              fileName={validFileName}
              onAddToVault={handleAddToVaultFromValidation}
            />
          </div>
        )}

        {/* ===== TAB: VAULT ===== */}
        {activeTab === 'vault' && (
          <div style={{ maxWidth: '660px' }}>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <div className="section-title" style={{ marginBottom: 0 }}>Document vault</div>
              <span className="text-muted text-sm">{vault.length} file{vault.length !== 1 ? 's' : ''} stored</span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <DocumentUpload
                onFile={handleVaultUpload}
                label="Click or drag to upload a document"
                hint="PDF, JPG, PNG — documents are stored for this session"
              />
            </div>

            <DocumentList
              docs={vault}
              onRemove={removeFromVault}
              onValidate={validateFromVault}
            />
          </div>
        )}
      </div>
    </>
  )
}
