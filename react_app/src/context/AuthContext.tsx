// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store/store'
import { setTokens, clearTokens } from '../store/slices/authSlice'


interface AuthContextType {
  isAuthenticated: boolean
  login: (accessToken: string, refreshToken?: string, isActive?: boolean) => void
  logout: () => void
  isAuthReady: boolean
  isActive: boolean | null
  isBlocked: boolean | null
  googleTempToken: string | null
  //user: UserProfile | null
  setGoogleTempToken: (token: string | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)
export const useAuth = () => useContext(AuthContext)!

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isBlocked, setIsBlocked] = useState<boolean | null>()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [isActive, setIsActive] = useState<boolean | null>(null)

  const [googleTempTokenState, setGoogleTempTokenState] = useState<string | null>(null)

  const setGoogleTempToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem('googleTempToken', token)
    } else {
      localStorage.removeItem('googleTempToken')
    }
    setGoogleTempTokenState(token)
  }, [])

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const active = localStorage.getItem('isActive')

    const storedGoogleTempToken = localStorage.getItem('googleTempToken')
    if (storedGoogleTempToken) {
      setGoogleTempTokenState(storedGoogleTempToken)
    }

    if (accessToken || refreshToken) {
      dispatch(setTokens({
        accessToken: accessToken ?? null,
        refreshToken: refreshToken ?? null,
        isActive: active ? active === 'true' : null,
      }))
      setIsAuthenticated(!!accessToken)
      setIsActive(active ? active === 'true' : null)
    } else {
      dispatch(clearTokens())
      setIsAuthenticated(false)
      setIsActive(null)
    }

    setIsAuthReady(true)
  }, [dispatch])

  const login = (accessToken: string, refreshToken?: string, isActive?: boolean, isBlockedServer?: boolean) => {
    localStorage.setItem('accessToken', accessToken)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
      if (typeof isActive !== 'undefined') {
        localStorage.setItem('isActive', String(isActive))
        setIsActive(isActive)
      }
      if (typeof isBlockedServer == 'undefined') {
        setIsBlocked(isBlockedServer)
      }
      dispatch(setTokens({ accessToken, refreshToken: refreshToken ?? null, isActive: isActive ?? null }))
      setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('isActive')
    localStorage.removeItem('googleTempToken') 
    dispatch(clearTokens())
    setIsAuthenticated(false)
    setIsActive(null)
    setGoogleTempTokenState(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        isAuthReady,
        isActive,
        isBlocked,
        googleTempToken: googleTempTokenState,
        setGoogleTempToken, 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
