import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hotelpro_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hotelpro_token') || null);
  const [loading, setLoading] = useState(true);

  // Check profile on mount if token exists
  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          if (res.data?.success) {
            setUser(res.data.user);
            localStorage.setItem('hotelpro_user', JSON.stringify(res.data.user));
          }
        } catch {
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success) {
      const { token: newToken, user: userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('hotelpro_token', newToken);
      localStorage.setItem('hotelpro_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data?.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('hotelpro_token', newToken);
      localStorage.setItem('hotelpro_user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const updateProfile = async (data) => {
    const res = await api.put('/auth/profile', data);
    if (res.data?.success) {
      const { user: updatedUser, token: newToken } = res.data;
      setUser(updatedUser);
      localStorage.setItem('hotelpro_user', JSON.stringify(updatedUser));
      if (newToken) {
        setToken(newToken);
        localStorage.setItem('hotelpro_token', newToken);
      }
      return updatedUser;
    }
    throw new Error(res.data?.message || 'Profile update failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hotelpro_token');
    localStorage.removeItem('hotelpro_user');
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
