import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; userType?: 'admin' | 'user' }>;
  register: (userData: Omit<User, 'id' | 'coins' | 'userType' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  addCoins: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored auth token and get current user
    const token = localStorage.getItem('authToken');
    if (token) {
      getCurrentUser();
    }
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await apiService.getCurrentUser();
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
      // Clear invalid token
      localStorage.removeItem('authToken');
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; userType?: 'admin' | 'user' }> => {
    try {
      const response = await apiService.login(username, password);
      if (response.success) {
        setUser(response.user);
        return { success: true, userType: response.userType };
      }
      return { success: false };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false };
    }
  };

  const register = async (userData: Omit<User, 'id' | 'coins' | 'userType' | 'createdAt'>): Promise<boolean> => {
    try {
      const response = await apiService.register(userData);
      if (response.success) {
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const updateProfile = (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      apiService.updateProfile(userData);
      setUser({ ...user, ...userData });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const addCoins = (amount: number) => {
    if (!user) return;
    
    try {
      apiService.addCoins(amount);
      setUser({ ...user, coins: user.coins + amount });
    } catch (error) {
      console.error('Failed to add coins:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, addCoins }}>
      {children}
    </AuthContext.Provider>
  );
};