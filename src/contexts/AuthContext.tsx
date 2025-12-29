import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAdmin: (phone: string, password: string) => Promise<boolean>;
  signup: (name: string, phone: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (phone: string, email: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Aliyu Ibrahim',
    email: 'aliyu@example.com',
    phone: '08012345678',
    role: 'applicant',
    password: 'password123',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Credit Admin',
    email: 'credit@ymfb.com',
    phone: '08011111111',
    role: 'credit',
    password: 'admin123',
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Audit Admin',
    email: 'audit@ymfb.com',
    phone: '08022222222',
    role: 'audit',
    password: 'admin123',
    createdAt: new Date(),
  },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('ymfb_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (emailOrPhone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(
        u => (u.email === emailOrPhone || u.phone === emailOrPhone) && 
             u.password === password &&
             u.role === 'applicant'
      );
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('ymfb_user', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAdmin = async (phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(
        u => u.phone === phone && 
             u.password === password &&
             (u.role === 'credit' || u.role === 'audit')
      );
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('ymfb_user', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, phone: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const exists = mockUsers.some(u => u.email === email || u.phone === phone);
      if (exists) {
        return false;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        role: 'applicant',
        createdAt: new Date(),
      };
      
      mockUsers.push({ ...newUser, password });
      setUser(newUser);
      localStorage.setItem('ymfb_user', JSON.stringify(newUser));
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ymfb_user');
  };

  const resetPassword = async (phone: string, email: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userIndex = mockUsers.findIndex(
        u => u.phone === phone && u.email === email
      );
      
      if (userIndex !== -1) {
        mockUsers[userIndex].password = newPassword;
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginAdmin, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
