import { useState, useEffect } from 'react';
import type { User, LoginCredentials, RegisterData } from '../types/auth';
import { api } from '../services/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao fazer login';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      const { data: responseData } = await api.post('/auth/register', data);
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('user', JSON.stringify(responseData));
      setUser(responseData);
      return responseData;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao realizar cadastro';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout
  };
}