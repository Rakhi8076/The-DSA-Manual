import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // 👈 new
  const verified = searchParams.get("verified"); // 👈 new
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("All fields are required."); return; }
    try {
      setLoading(true);
      const res = await login(email, password);

      // 🔥 IMPORTANT LINE (ADD THIS)
      localStorage.setItem("userId", res.user._id);
      console.log("LOGIN RESPONSE:", res);

      navigate("/sheets");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16 gradient-bg">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-2xl glass-card p-8"
        >
          <div className="text-center mb-8">
            {/* <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
              <LogIn className="h-7 w-7 text-primary-foreground" />
            </div> */}
            <h1 className="text-2xl font-bold font-display text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              Welcome Back
            </h1>
            <p className="text-sm mt-1" style={{ color: "hsl(243 75% 55%)" }}>Continue tracking your progress</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 👇 Verified message */}
            {verified && (
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-500">
                ✅ Email verified! You can now login.
              </div>
            )}
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10" />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 rounded-full font-semibold shadow-lg" disabled={loading}>
              {loading ? "Logging in…" : "Login"}
            </Button>

            <p className="text-sm text-center text-foreground/70">
              Don't have an account?{" "}
              <Link to="/signup" className="text-black font-medium hover:underline">Sign Up</Link>
            </p>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
    
  );
}
