import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { getSubService } from '../../services/api'
import { isAuthenticated } from '../../utils/auth'

export default function LearnersLicense() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true })
      return
    }

    async function loadData() {
      const dbData = await getSubService('driving', 'learners-license')
      setData(dbData)
    }
    loadData()
  }, [navigate])

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingBottom: '80px' }}>
        <button
          className="back-link"
          onClick={() => navigate('/process/driving')}
          style={{ marginBottom: '24px' }}
        >
          ← Back to Driving License Services
        </button>

        <div className="page-header">
          <h1>Driver's / Learner's License</h1>
          <p>Apply for a new Learner's License or permanent Driving License</p>
        </div>

        {data && data.steps && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>
              Step-by-step instructions
            </h3>
            <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              {data.steps.map((step, index) => (
                <li key={index} style={{ marginBottom: '12px' }}>
                  <strong>{step.title}:</strong> {step.desc}
                </li>
              ))}
            </ol>
          </div>
        )}

        {data && data.docs && (
          <div style={{ marginTop: '24px' }}>
            <div className="section-title">Required documents</div>
            {data.docs.map((doc, i) => (
              <div key={i} className="doc-req">
                <div className="doc-req-info">
                  <h5>{doc.name}</h5>
                  <span>{doc.format} · {doc.size}</span>
                </div>
                <span className="doc-badge">
                  {doc.format.split('/')[0]}
                </span>
              </div>
            ))}
          </div>
        )}

        {data && data.portalLink && (
          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}
          >
            <h4 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>
              Ready to apply?
            </h4>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px' }}>
              Visit the official portal to start your application process.
            </p>

            <a
              href={data.portalLink}
              target="_blank"
              rel="noreferrer"
              className="button button-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}
            >
              Go to {data.portalName || 'Portal'}
              <span style={{ fontSize: '16px' }}>↗</span>
            </a>
          </div>
        )}
      </div>
    </>
  )
}
