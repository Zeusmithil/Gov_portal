import React, { useState } from 'react'
import { apiFormat } from '../services/api'

export default function DocumentStatus({ validation, fileName, onAddToVault }) {
  const [fixMsg, setFixMsg] = useState('')
  const [fixing, setFixing] = useState('')
  const [fixed, setFixed] = useState(false)

  if (!validation) return null

  const { sizeValid, formatValid, sizeKB, format } = validation
  const allValid = sizeValid && formatValid

  async function handleFix(action) {
    setFixing(action)
    setFixMsg('')
    try {
      const res = await apiFormat(action)
      setFixMsg(res.message)
      setFixed(true)
    } catch {
      setFixMsg('Fix failed. Please try again.')
    } finally {
      setFixing('')
    }
  }

  return (
    <div className="card" style={{ padding: '20px', marginTop: '20px' }}>
      <div className="flex-between" style={{ marginBottom: '16px' }}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          Validation result
        </div>
        {allValid || fixed
          ? <span className="status-success">✓ Ready</span>
          : <span className="status-error">✗ Issues found</span>}
      </div>

      <div className="validation-row">
        <span className="validation-label">File name</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '13px' }}>{fileName}</span>
      </div>

      <div className="validation-row">
        <span className="validation-label">File size</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {sizeKB} KB
          {sizeValid
            ? <span className="status-success">✓ Valid</span>
            : <span className="status-error">✗ Too large (max 2MB)</span>}
        </span>
      </div>

      <div className="validation-row">
        <span className="validation-label">Format</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {format}
          {formatValid
            ? <span className="status-success">✓ Accepted</span>
            : <span className="status-error">✗ Not accepted</span>}
        </span>
      </div>

      {/* Show fix options if invalid */}
      {!allValid && !fixed && (
        <>
          <div className="divider" style={{ margin: '16px 0' }} />
          <div className="section-title" style={{ fontSize: '14px' }}>Fix your document</div>
          <div className="formatter-actions">
            {!sizeValid && (
              <button
                className="button button-secondary"
                onClick={() => handleFix('compress')}
                disabled={!!fixing}
              >
                {fixing === 'compress'
                  ? <><span className="spinner spinner-dark" /> Compressing...</>
                  : '🗜️ Compress file'}
              </button>
            )}
            {!formatValid && (
              <button
                className="button button-secondary"
                onClick={() => handleFix('convert')}
                disabled={!!fixing}
              >
                {fixing === 'convert'
                  ? <><span className="spinner spinner-dark" /> Converting...</>
                  : '🔄 Convert format'}
              </button>
            )}
            <button
              className="button button-secondary"
              onClick={() => handleFix('resize')}
              disabled={!!fixing}
            >
              {fixing === 'resize'
                ? <><span className="spinner spinner-dark" /> Resizing...</>
                : '↔️ Resize image'}
            </button>
          </div>
        </>
      )}

      {/* Fix result / success messages */}
      {fixMsg && (
        <div className="alert alert-success" style={{ marginTop: '12px' }}>
          ✓ {fixMsg} — Document is ready for submission
        </div>
      )}
      {(allValid || fixed) && !fixMsg && (
        <div className="alert alert-success" style={{ marginTop: '16px' }}>
          ✓ Document is ready for submission
        </div>
      )}

      {/* Add to vault */}
      {(allValid || fixed) && onAddToVault && (
        <button
          className="button button-primary"
          style={{ marginTop: '12px' }}
          onClick={onAddToVault}
        >
          Add to vault →
        </button>
      )}
    </div>
  )
}
