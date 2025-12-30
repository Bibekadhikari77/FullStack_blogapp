import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'reader' | 'author' | 'admin';
  avatar?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string, avatar?: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  isAuthor: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        Cookies.remove('token');
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      Cookies.set('token', token, { expires: 7 });
      setUser(user);
      toast.success('Logged in successfully!');
      router.push('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'reader', avatar?: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role, avatar });
      const { token, user } = response.data;
      
      Cookies.set('token', token, { expires: 7 });
      setUser(user);
      toast.success('Registration successful!');
      router.push('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAuthor: user?.role === 'author' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
