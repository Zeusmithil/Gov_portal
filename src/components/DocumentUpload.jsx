import React, { useRef, useState } from 'react'

export default function DocumentUpload({ onFile, label = 'Drop file here or click to browse', hint = 'PDF, JPG, PNG — up to 2MB' }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  function handleChange(e) {
    const file = e.target.files[0]
    if (file) {
      onFile(file)
      e.target.value = ''
    }
  }

  return (
    <div
      className={`upload-zone ${dragging ? 'drag-over' : ''}`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <span className="upload-icon">📄</span>
      <h4>{label}</h4>
      <p>{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  )
}
