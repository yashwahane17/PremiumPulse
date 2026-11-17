import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('premiumpulse_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('premiumpulse_token');
      if (storedToken) {
        try {
          const profile = await api.getMe();
          setUser(profile);
        } catch (err) {
          console.error("Token verification failed:", err);
          localStorage.removeItem('premiumpulse_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem('premiumpulse_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const adminLogin = async (email, password) => {
    const data = await api.adminLogin(email, password);
    localStorage.setItem('premiumpulse_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const register = async (fullName, email, password) => {
    const data = await api.register(fullName, email, password);
    localStorage.setItem('premiumpulse_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const quickDemoLogin = async () => {
    return login("demo@premiumpulse.ai", "Demo@12345");
  };

  const quickAdminDemoLogin = async () => {
    return adminLogin("admin@premiumpulse.ai", "Admin@Pulse2026!");
  };

  const logout = () => {
    localStorage.removeItem('premiumpulse_token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isCustomer = user?.role === 'USER';

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      adminLogin, 
      register, 
      quickDemoLogin, 
      quickAdminDemoLogin, 
      logout,
      isAdmin,
      isCustomer
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
