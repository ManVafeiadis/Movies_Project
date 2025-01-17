import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/api';
import { AuthContextType, User, JwtPayload } from '../types';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      setUser({
        username: decoded.username,
        isAdmin: decoded.is_staff || false,
        token
      });
      setTokenExpiry(new Date(decoded.exp * 1000));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await AuthService.login(username, password);
      const { access, refresh } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refresh_token', refresh);
      
      const decoded = jwtDecode<JwtPayload>(access);
      setUser({
        username: decoded.username,
        isAdmin: decoded.is_staff || false,
        token: access
      });
      setTokenExpiry(new Date(decoded.exp * 1000));
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setTokenExpiry(null);
  };

  const register = async (
    username: string, 
    email: string, 
    password: string, 
    password2: string
  ) => {
    try {
      await AuthService.register({ 
        username, 
        email, 
        password1: password, 
        password2 
      });
      await login(username, password);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  return (
    <AuthContext.Provider 
      value={{ user, login, logout, register, tokenExpiry }}
    >
      {children}
    </AuthContext.Provider>
  );
};
