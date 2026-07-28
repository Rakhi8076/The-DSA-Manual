
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { loginUser, signupUser } from "@/lib/api";

function getTokenExpiry(token: string): number | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(padded));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}
export interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("dsa-user");
      if (!stored || stored === "undefined") return null;
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem("dsa-user");
      return null;
    }
  });

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginUser({ email, password });
    localStorage.setItem("dsa-token", data.token);
    localStorage.setItem("dsa-user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      await signupUser({ name, email, password });
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("dsa-token");
    localStorage.removeItem("dsa-user");
    // ✅ chat history nahi hatao — user wapas login kare toh history mile
    setUser(null);
  }, []);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("dsa-token");
    if (!token) return;

    const expiryTime = getTokenExpiry(token);
    if (!expiryTime) return;

    const timeLeft = expiryTime - Date.now();

    if (timeLeft <= 0) {
      logout();
      window.location.href = "/?sessionExpired=true";
      return;
    }

    const timer = setTimeout(() => {
      logout();
      window.location.href = "/?sessionExpired=true";
    }, timeLeft);

    return () => clearTimeout(timer);
  }, [user, logout]);



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