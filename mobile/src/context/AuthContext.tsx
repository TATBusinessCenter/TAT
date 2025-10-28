import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api, setAuthToken } from '../services/api';

type User = {
  id: number;
  name?: string | null;
  email: string;
  role: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: newToken, user: loggedUser } = response.data;
    setToken(newToken);
    setUser(loggedUser);
    setAuthToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setAuthToken();
  }, []);

  const value = useMemo(() => ({ user, token, login, logout }), [login, logout, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
