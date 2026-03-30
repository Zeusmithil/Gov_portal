import React from 'react'

const FILE_ICONS = {
  PDF: '📄',
  JPG: '🖼️',
  JPEG: '🖼️',
  PNG: '🖼️',
}

export default function DocumentList({ docs, onRemove, onValidate }) {
  if (!docs || docs.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🗂️</span>
        <p>Your uploaded documents will appear here</p>
      </div>
    )
  }

  return (
    <div>
      {docs.map((doc) => (
        <div key={doc.id} className="doc-card">
          <div className="doc-icon">{FILE_ICONS[doc.ext] || '📁'}</div>
          <div className="doc-info">
            <h5>{doc.name}</h5>
            <span>{doc.ext} · {doc.size} · {doc.date}</span>
          </div>
          <div className="doc-actions">
            <span className="status-success">✓ Stored</span>
            {onValidate && (
              <button
                className="button button-secondary"
                style={{ fontSize: '12px', padding: '5px 10px' }}
                onClick={() => onValidate(doc)}
              >
                Validate
              </button>
            )}
            {onRemove && (
              <button
                className="button button-danger"
                style={{ fontSize: '12px', padding: '5px 10px' }}
                onClick={() => onRemove(doc.id)}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
