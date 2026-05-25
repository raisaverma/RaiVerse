import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Auth Context — Manages authentication state across the app.
 * Provides: user, token, role, isAdmin, login, register, logout, loading.
 * Persists token in localStorage and auto-loads user profile on mount.
 */

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Derived state: is the current user an admin?
  const isAdmin = user?.role === 'admin';

  /**
   * On mount: if a token exists in localStorage, fetch user profile.
   * This keeps the user logged in across page refreshes.
   */
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data.data);
        } catch (error) {
          // Token is invalid or expired — clear it
          console.error('Auto-login failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  /**
   * Register a new user.
   * On success: stores token, sets user state.
   */
  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token: newToken, ...userData } = res.data.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  /**
   * Login an existing user.
   * On success: stores token, sets user state.
   */
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, ...userData } = res.data.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  /**
   * Logout: clear token and user state.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAdmin,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
