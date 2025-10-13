"use client"

import { createContext, useContext, useState, ReactNode } from 'react';

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// 👇 1. Define what your AuthContext will hold
interface AuthContextType {
  user: any; // You can replace 'any' with your User type if you have one
  loading: boolean;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// 👇 2. Create the context with the proper type
const AuthContext = createContext<AuthContextType | null>(null);

// 👇 3. Props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/user/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await res.json();
      setUser(data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loading, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 👇 4. Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
