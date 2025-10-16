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
  register: (email: string, password: string) => Promise<{ success: boolean; data?: UserResponse; error?: string }>;
  loginByEmail: (email: string, password: string) => Promise<{ success: boolean; data?: UserResponse; error?: string }>;
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
        const decoded = jwtDecode<{ exp: number, upn: string, groups: string[] }>(savedToken);
        const now = Math.floor(Date.now() / 1000);
        console.log("Token", decoded);
        console.log("Token exp:", decoded.exp);
        console.log("Current time:", now);
        console.log("Time until expiry:", decoded.exp - now, "seconds");
      
        if (decoded.exp < now) {
          console.warn("Token expired — logging out");
          logout();
        } else {
          // Token is valid, set it
          console.log("Resetting user/token in useEffect");
          if (user == null) {
            const userFromToken: User = {email: decoded.upn, isAdmin: decoded.groups.includes("Admin"), orders: []}
            setUser(userFromToken);
          }
          
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
      return { success: true, data};
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
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.warn("Loggin user out");
    router.push("/login");
    localStorage.removeItem("token");
    setJwtToken(null);
    setUser(null);
  }

  const updateUserData = (data: UserResponse) => {
    if (data.entity) {
        const { email, jwtToken, isAdmin } = data.entity;
        setUser({ email, orders: [], isAdmin });
        setJwtToken(jwtToken ?? null);
        if (jwtToken) localStorage.setItem("token", jwtToken);
    }
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
