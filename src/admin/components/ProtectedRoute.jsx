import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAdminAuthenticated } from '../utils/adminAuth.js'

export default function ProtectedRoute({ children }) {
  return isAdminAuthenticated() ? children : <Navigate to="/login" replace />
}