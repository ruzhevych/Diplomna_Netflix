import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAuthReady: boolean; // 👈 нове
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext)!;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token on load:', token);
    setIsAuthenticated(!!token);
    setIsAuthReady(true); 
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};
