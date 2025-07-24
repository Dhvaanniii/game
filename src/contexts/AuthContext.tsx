import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import type { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<{ success: boolean; userType?: 'admin' | 'user' }>;
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
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Load user from localStorage instantly
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  // No loading state needed for instant UI

  useEffect(() => {
    // Always validate token in the background
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
        localStorage.setItem('user', JSON.stringify(response.user));
      } else if (response.error === 'Invalid token' || response.error === 'Access token required') {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
      // If other error, do nothing: keep user in UI
    } catch (error) {
      // Network/server error: do NOT log out, keep user in UI
      // Optionally, show a warning/toast to the user here
    }
  };

  const login = async (identifier: string, password: string): Promise<{ success: boolean; userType?: 'admin' | 'user' }> => {
    try {
      const response = await apiService.login(identifier, password);
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { success: true, userType: response.userType?.trim() };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  };

  const register = async (userData: Omit<User, 'id' | 'coins' | 'userType' | 'createdAt'>): Promise<boolean> => {
    try {
      const response = await apiService.register(userData);
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (!user) return;
    try {
      apiService.updateProfile(userData);
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      // handle error
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