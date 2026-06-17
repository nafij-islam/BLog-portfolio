'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../data/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, passwordHash: string) => Promise<boolean>;
  register: (name: string, email: string, passwordHash: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setUser(json.data);
          }
        }
      } catch (e) {
        console.error('Failed to fetch user session:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMe();
  }, []);

  const login = async (email: string, passwordHash: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: passwordHash }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setUser(json.data);
        setIsLoading(false);
        return true;
      } else {
        if (json.message && json.message.includes('suspended')) {
          alert(json.message);
        }
      }
    } catch (e) {
      console.error('Login request failed:', e);
    }
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, passwordHash: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: passwordHash }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setUser(json.data);
        setIsLoading(false);
        return true;
      }
    } catch (e) {
      console.error('Registration request failed:', e);
    }
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout request failed:', e);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setUser(json.data);
        }
      }
    } catch (e) {
      console.error('Failed to refresh user session:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
