// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  userId: string | null;
  isAuthReady: boolean;
  login: (token: string, remember?: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string | null) {
  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    const json = atob(payload);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // спочатку шукаємо у localStorage (remember), потім sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || null;
    if (token) {
      setIsAuthenticated(true);
      const payload = parseJwt(token);
      const id = payload?.uid || payload?.sub || null;
      setUserId(id);
    } else {
      setIsAuthenticated(false);
      setUserId(null);
    }
    setIsAuthReady(true);
  }, []);

  const login = (token: string, remember = true) => {
    if (remember) {
      localStorage.setItem('token', token);
      sessionStorage.removeItem('token');
    } else {
      sessionStorage.setItem('token', token);
      localStorage.removeItem('token');
    }
    setIsAuthenticated(true);
    const payload = parseJwt(token);
    const id = payload?.uid || payload?.sub || null;
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
