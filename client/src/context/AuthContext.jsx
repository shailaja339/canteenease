import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data) {
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      showToast('success', `Welcome back, ${res.data.name?.split(' ')[0]}!`);
    }
    return res.data;
  };

  const register = async (userData) => {
    const isStaffRegistration = Boolean(userData.staffCode);
    const endpoint = isStaffRegistration ? '/auth/staff/register' : '/auth/register';
    const res = await api.post(endpoint, userData);
    if (res.data) {
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      showToast('success', `Account created for ${res.data.name?.split(' ')[0]}!`);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    showToast('info', 'You have been logged out.');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
