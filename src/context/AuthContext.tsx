import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login, logout, getCurrentUser } from '../lib/auth';
import type { AuthUser } from '../lib/types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getCurrentUser();
    setUser(savedUser);
    setLoading(false);
  }, []);

  const handleLogin = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    const loggedInUser = await login(usernameOrEmail, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

