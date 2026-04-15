import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminUsers() {
  const navigate = useNavigate()
  const [serviceId, setServiceId] = useState('driving')
  const [subserviceId, setSubserviceId] = useState('learners-license')
  const [steps, setSteps] = useState([{ title: '', desc: '' }])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleAddStep = () => setSteps([...steps, { title: '', desc: '' }])
  
  const handleStepChange = (index, field, value) => {
    const newSteps = [...steps]
    newSteps[index][field] = value
    setSteps(newSteps)
  }
  
  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const handleFetchCurrent = async () => {
     setLoading(true)
     try {
        const res = await fetch(`http://localhost:8000/api/steps/${serviceId}/${subserviceId}`)
        const data = await res.json()
        if (data.steps) {
           setSteps(data.steps)
           setMessage('Loaded from database.')
        } else {
           setSteps([{ title: '', desc: '' }])
           setMessage('No database records exist for this service yet. Enter new steps to override frontend static steps.')
        }
     } catch (e) {
        setMessage('Error fetching.')
     } finally {
        setLoading(false)
     }
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage('')
    try {
      const payload = {
         service_id: serviceId,
         subservice_id: subserviceId,
         steps: steps.filter(s => s.title.trim() !== '')
      }
      const token = localStorage.getItem('unavoidable_token')
      const res = await fetch('http://localhost:8000/api/admin/steps', {
        method: 'PUT',
        headers: { 
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if(data.success) {
         setMessage('Successfully pushed steps to database! Live on portal.')
      }
    } catch(e) {
      setMessage('Failed to save.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ paddingBottom: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>🪜 Manage Platform Steps</h1>
        <button className="button button-ghost" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
      
      <div className="card" style={{ marginBottom: '20px' }}>
        <p style={{marginBottom: '20px'}}>Use this panel to override the hardcoded frontend steps with dynamic database steps.</p>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Service ID</label>
            <input className="input" value={serviceId} onChange={e => setServiceId(e.target.value)} placeholder="e.g. driving"/>
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>SubService ID</label>
            <input className="input" value={subserviceId} onChange={e => setSubserviceId(e.target.value)} placeholder="e.g. learners-license"/>
          </div>
          <div style={{display: 'flex', alignItems: 'flex-end'}}>
             <button className="button button-outline" onClick={handleFetchCurrent} disabled={loading}>
               Load DB Steps
             </button>
          </div>
        </div>
      </div>

      <div className="card">
         <h3 style={{marginBottom: '20px'}}>Steps Configuration</h3>
         {message && <div className="alert alert-success" style={{marginBottom: '20px'}}>{message}</div>}
         
         {steps.map((step, index) => (
            <div key={index} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '15px' }}>
               <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                  <strong>Step {index + 1}</strong>
                  <button className="button button-ghost" style={{color: 'red', padding: '5px 10px'}} onClick={() => handleRemoveStep(index)}>Remove</button>
               </div>
               <input 
                  className="input" 
                  value={step.title} 
                  onChange={e => handleStepChange(index, 'title', e.target.value)} 
                  placeholder="Step Title" 
                  style={{marginBottom: '10px'}}
               />
               <textarea 
                  className="input" 
                  value={step.desc} 
                  onChange={e => handleStepChange(index, 'desc', e.target.value)} 
                  placeholder="Step Description..." 
                  rows={2}
               />
            </div>
         ))}
         
         <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button className="button button-outline" onClick={handleAddStep}>+ Add Step</button>
            <button className="button button-primary" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving to Database...' : 'Deploy Updates'}
            </button>
         </div>
      </div>
    </div>
  )
}

