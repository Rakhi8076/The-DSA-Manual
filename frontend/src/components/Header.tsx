import { Code2, LogOut, User, Menu, X, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";




export function Header() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // const navLinks = [
  //   { to: "/", label: "Home" },
  //   ...(user ? [{ to: "/#sheets", label: "Sheets" }] : []),
  // ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/20 bg-background/70 backdrop-blur-xl">

      {/* 🔥 FIXED WIDTH */}
      <div className="w-full px-6 lg:px-10 flex h-20 items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight font-display text-foreground">
              The DSA Manual
            </span>
            <span className="text-[10px] text-foreground/40 font-mono tracking-widest uppercase">
              Master DSA
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === "/"
              ? "bg-card/60 text-foreground shadow-md"
              : "text-foreground/50 hover:text-foreground "
              }`}
          >
            Home
          </Link>
          <Link
            to="/sheets"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === "/sheets"
              ? "bg-card/60 text-foreground shadow-md"
              : "text-foreground/50 hover:text-foreground "
              }`}
          >
            Sheets
          </Link>
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">

              {/* User */}
              <div
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border/30 cursor-pointer hover:bg-card/70 transition"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20">
                  <User className="h-3.5 w-3.5 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {user.name}
                </span>
              </div>

              {/* Logout */}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-foreground/50 hover:text-foreground hover:bg-card/40 gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-xs">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-foreground/60 hover:text-foreground"
              >
                <Link to="/login">Login</Link>
              </Button>

              <Button
                size="sm"
                asChild
                className="rounded-xl bg-accent hover:bg-accent/90 shadow-lg shadow-accent/25 font-semibold"
              >
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile button */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-border/30 bg-card/50 text-foreground/60"
        >
          {mobileOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-card/50 transition-all"
          >
            <BookOpen className="h-4 w-4" />
            Home
          </Link>

          <Link
            to="/sheets"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-card/50 transition-all"
          >
            <BookOpen className="h-4 w-4" />
            Sheets
          </Link>

          <div className="pt-2 border-t border-border/20">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20">
                    <User className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-foreground/50 gap-1"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 px-3 pt-1">
                <Button variant="ghost" size="sm" asChild className="flex-1">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                </Button>

                <Button
                  size="sm"
                  asChild
                  className="flex-1 bg-accent hover:bg-accent/90"
                >
                  <Link to="/signup" onClick={() => setMobileOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}