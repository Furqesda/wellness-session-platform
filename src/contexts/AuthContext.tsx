import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authState = authService.getAuthState();
    setUser(authState.user);
    setIsAuthenticated(authState.isAuthenticated);
  }, []);

  const login = async (email: string, password: string) => {
    const result = authService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const signup = async (email: string, password: string, name: string) => {
    const result = authService.signup(email, password, name);
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};