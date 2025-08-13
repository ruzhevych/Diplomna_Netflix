// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store/store'
import { setTokens, clearTokens } from '../store/slices/authSlice'

interface AuthContextType {
  isAuthenticated: boolean
  login: (accessToken: string, refreshToken?: string) => void
  logout: () => void
  isAuthReady: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => useContext(AuthContext)!

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    console.log('AuthProvider load tokens:', { accessToken, refreshToken })

    if (accessToken || refreshToken) {
      dispatch(setTokens({ accessToken, refreshToken }))
      setIsAuthenticated(!!accessToken)
    } else {
      dispatch(clearTokens())
      setIsAuthenticated(false)
    }

    setIsAuthReady(true)
  }, [dispatch])

  const login = (accessToken: string, refreshToken?: string) => {
    localStorage.setItem('accessToken', accessToken)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
    dispatch(setTokens({ accessToken, refreshToken: refreshToken ?? null }))
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    dispatch(clearTokens())
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  )
}
