import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserAuthContext = createContext();

const API_URL = import.meta.env.VITE_BACKEND_URL || '';
const AUTH_REDIRECT_URL = window.location.origin + '/user/login';
const EMERGENT_AUTH_URL = 'https://auth.emergentagent.com/';

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // Check if user is already authenticated
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true
      });
      
      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Not authenticated - that's okay
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    // Redirect to Emergent Auth
    window.location.href = `${EMERGENT_AUTH_URL}?redirect=${encodeURIComponent(AUTH_REDIRECT_URL)}`;
  };

  const processSessionId = async (sessionId) => {
    try {
      setLoading(true);
      
      // Send session_id to backend
      const response = await axios.post(
        `${API_URL}/api/auth/session`,
        { session_id: sessionId },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        // Clean URL fragment
        window.history.replaceState({}, document.title, window.location.pathname);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error processing session:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const registerWithEmail = async (email, password, name) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        { email, password, name },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    processSessionId,
    logout,
    refreshUser: checkSession
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within UserAuthProvider');
  }
  return context;
};
