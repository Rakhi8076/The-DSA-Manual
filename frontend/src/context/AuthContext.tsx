import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { loginUser, signupUser } from "@/lib/api";

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
    // ✅ loginUser already throws if !res.ok via handleResponse
    localStorage.setItem("dsa-token", data.token);
    localStorage.setItem("dsa-user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      // ✅ Signup just sends email — no token returned, no token check
      await signupUser({ name, email, password });
      // Don't setUser — user must verify email first
    },
    []
  );

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