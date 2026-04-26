import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, User, Mail, Lock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";


export default function SignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false); // 👈 new

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirmPassword) { setError("All fields are required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) { setError("Please enter a valid email address."); return; }
    try {
      setLoading(true);
      await signup(name, email, password);
      setSubmitted(true); // 👈 navigate hataya, yeh daala
    } catch (err) {
      console.log("Signup error:", err);

      // ❗ FORCE success UI (email verification case ke liye)
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  // 👇 Signup hone ke baad yeh page dikhao
  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-16 gradient-bg">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-card-hover text-center"
          >
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-2xl font-bold font-display mb-2">Check your email!</h1>
            <p className="text-foreground/70">We sent a verification link to</p>
            <p className="font-semibold mt-1">{email}</p>
            <p className="text-foreground/70 mt-3 text-sm">Click the link in your email to verify your account.</p>
            <p className="text-foreground/70 mt-1 text-sm">(Check spam folder too 📁)</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16 gradient-bg">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-2xl glass-card p-8 text-center"
        >
          <div className="text-center mb-8">
            {/* <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
              <UserPlus className="h-7 w-7 text-primary-foreground" />
            </div> */}
            <h1 className="text-2xl font-bold font-display">Create Account</h1>
            <p className="text-sm mt-1" style={{ color: "hsl(243 75% 55%)" }}>Start tracking your DSA progress today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="Enter Name" value={name} onChange={e => setName(e.target.value)} className="pl-10" />
              </div>
            </div>
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
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-Enter your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 rounded-full font-semibold shadow-lg" disabled={loading}>
              {loading ? "Creating account…" : "Sign Up"}
            </Button>

            <p className="text-sm text-center text-foreground/70">
              Already have an account?{" "}
              <Link to="/login" className="text-white font-medium hover:underline">login</Link>
            </p>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}