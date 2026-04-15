import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import AdminApp from './AdminApp'
import '../style.css'

ReactDOM.createRoot(document.getElementById('admin-root')).render(
  <React.StrictMode>
    <HashRouter>
      <AdminApp />
    </HashRouter>
  </React.StrictMode>
)