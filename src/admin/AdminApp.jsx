import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminSuggestions from './pages/AdminSuggestions'
import AdminServices from './pages/AdminServices'
import ProtectedRoute from './components/ProtectedRoute'

export default function AdminApp() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/users" 
        element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} 
      />
      <Route 
        path="/suggestions" 
        element={<ProtectedRoute><AdminSuggestions /></ProtectedRoute>} 
      />
      <Route 
        path="/services" 
        element={<ProtectedRoute><AdminServices /></ProtectedRoute>} 
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
