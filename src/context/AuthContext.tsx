import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  activeRole: UserRole;
  switchRole: (role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('nearwear_token'));
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      if (token) {
        const u = await api.getMe();
        setUser(u);
      } else {
        // Automatically log in default customer demo on first load so user immediately sees a working app!
        const res = await api.switchDemo('CUSTOMER');
        localStorage.setItem('nearwear_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
    } catch (err) {
      console.warn('Auth initialize fallback to demo:', err);
      try {
        const res = await api.switchDemo('CUSTOMER');
        localStorage.setItem('nearwear_token', res.token);
        setToken(res.token);
        setUser(res.user);
      } catch (e) {
        console.error('Failed to initialize demo user:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    localStorage.setItem('nearwear_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('nearwear_token');
    setToken(null);
    setUser(null);
  };

  const switchRole = async (targetRole: UserRole) => {
    setLoading(true);
    try {
      const res = await api.switchDemo(targetRole);
      localStorage.setItem('nearwear_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } catch (err) {
      console.error('Role switch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeRole: UserRole = user?.role || 'CUSTOMER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        activeRole,
        switchRole,
        login,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
