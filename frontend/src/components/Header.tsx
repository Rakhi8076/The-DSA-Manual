import { Code2, LogOut, User, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    ...(user ? [{ to: "/#sheets", label: "Sheets" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-md border-b border-border/30">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent shadow-lg shadow-accent/25">
            <Code2 className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight font-display">DSA Sheets Hub</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-card/50 ${pathname === l.to ? "text-foreground" : "text-muted-foreground"}`}
            >
              {l.label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <User className="h-3.5 w-3.5" />
                </div>
                {user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" className="rounded-full shadow-lg" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={() => setMobileOpen(o => !o)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/50">
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/30 bg-card/95 backdrop-blur-xl px-4 py-3 space-y-2">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary">
              {l.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium flex items-center gap-1.5"><User className="h-4 w-4" /> {user.name}</span>
              <Button variant="ghost" size="sm" onClick={() => { logout(); setMobileOpen(false); }}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 px-3">
              <Button variant="ghost" size="sm" asChild><Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link></Button>
              <Button size="sm" asChild><Link to="/signup" onClick={() => setMobileOpen(false)}>Sign Up</Link></Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
