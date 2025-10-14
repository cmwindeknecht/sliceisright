"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { User, UserResponse } from '@/types/User';
import { useRouter } from "next/navigation";

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface AuthContext {
  user: User | null;
  jwtToken: string | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginByEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserData: (data: UserResponse) => void;
}

const AuthContext = createContext<AuthContext | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  /** 
  TODO send this token to the backend like this - quarkus automatically checks and throws a 401 if invalid
  
  fetch(`${API_URL}/orders`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  */
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // On page renders, check the status of the token 
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        debugger;
        const decoded = jwtDecode<{ exp: number }>(savedToken);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp < now) {
          console.warn("Token expired — logging out");
          logout();
        } else {
          // Token is valid, set it
          setJwtToken(savedToken);
        }
      } catch (e) {
        console.error("Invalid token:", e);
        logout();
      }
    }
  }, []);

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
      updateUserData(data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loginByEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/user/emailLogin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await res.json();
      updateUserData(data); 
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setJwtToken(null);
    setUser(null);
    router.push("/login");
  }

  const updateUserData = (data: UserResponse) => {
    if (data.entity) {
        const { email, jwtToken } = data.entity;
        setUser({ email, orders: [] });
        setJwtToken(jwtToken ?? null);
        if (jwtToken) localStorage.setItem("token", jwtToken);
    }
    debugger;
  };

  return (
    <AuthContext.Provider value={{ user, jwtToken, loading, register, loginByEmail, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
