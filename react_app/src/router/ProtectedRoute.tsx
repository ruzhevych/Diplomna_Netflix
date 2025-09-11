// src/router/ProtectedRoute.tsx
import { type JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGetProfileQuery } from '../services/userApi'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isAuthReady} = useAuth()
  const { data: profile} = useGetProfileQuery();
  
  const isBlocked = profile?.isBlocked;

  if (!isAuthReady) return null

  if (!isAuthenticated) return <Navigate to="/login" replace />

  console.log(isAuthenticated, isAuthReady, isBlocked)
 
  if (isBlocked) return <Navigate to="/blocked" replace />
  
  return children
}

export default ProtectedRoute
