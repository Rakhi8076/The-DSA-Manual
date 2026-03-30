import { createContext, useContext, useState, useCallback, ReactNode } from "react";

const API_URL = "http://localhost:8000";

export interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("dsa-user");
    return stored ? JSON.parse(stored) : null;
  });

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Signup failed");

    localStorage.setItem("dsa-token", data.token);
    localStorage.setItem("dsa-user", JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Login failed");

    localStorage.setItem("dsa-token", data.token);
    localStorage.setItem("dsa-user", JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("dsa-token");
    localStorage.removeItem("dsa-user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}