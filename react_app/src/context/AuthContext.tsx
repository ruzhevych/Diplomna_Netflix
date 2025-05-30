import { createContext, useState, useContext } from 'react'
import type { ReactNode } from 'react'

// Тип для користувача
type User = {
  email: string
  name: string
}

// Тип для контексту
type AuthContextType = {
  user: User | null
  login: (userData: User) => void
  logout: () => void
}

// Створюємо контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Хук для використання
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}