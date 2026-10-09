import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Logout handler
  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token');
    } catch (e) {
      console.warn('Storage clear error:', e);
    }
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  // Validate stored token and load session on initial mount / refresh
  const initializeAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken || storedToken.trim() === '') {
      setCurrentUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getCurrentUser();
      if (response && response.data?.user) {
        setCurrentUser(response.data.user);
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      console.warn('Session verification failed, logging out:', error.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    initializeAuth();

    // Listen for global unauthorized events (e.g. 401 token expiry from Axios interceptor)
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [initializeAuth, logout]);

  // Login handler
  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    const { user, token: receivedToken } = response.data;

    try {
      localStorage.setItem('token', receivedToken);
    } catch (e) {
      console.warn('Could not persist token:', e);
    }

    setToken(receivedToken);
    setCurrentUser(user);
    setIsAuthenticated(true);
    return response;
  };

  // Register handler
  const register = async (name, email, password) => {
    const response = await authService.register({ name, email, password });
    const { user, token: receivedToken } = response.data;

    try {
      localStorage.setItem('token', receivedToken);
    } catch (e) {
      console.warn('Could not persist token:', e);
    }

    setToken(receivedToken);
    setCurrentUser(user);
    setIsAuthenticated(true);
    return response;
  };

  const value = {
    currentUser,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
