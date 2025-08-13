// src/router/ProtectedRoute.tsx
import { type JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isAuthReady } = useAuth()

  if (!isAuthReady) return null 

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
