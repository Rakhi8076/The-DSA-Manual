import { Github, Linkedin, Code2, BookOpen, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-background/80 backdrop-blur-md">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent shadow-lg shadow-accent/25">
                <Code2 className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-lg font-bold font-display">The DSA Manual</span>
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed max-w-xs">
              Master Data Structures & Algorithms with curated sheets from top educators. Track your progress, one problem at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/" className="text-sm text-foreground/60 hover:text-foreground transition-colors w-fit">Home</Link>
              <Link to="/login" className="text-sm text-foreground/60 hover:text-foreground transition-colors w-fit">Login</Link>
              <Link to="/signup" className="text-sm text-foreground/60 hover:text-foreground transition-colors w-fit">Sign Up</Link>
            </div>
          </div>

          {/* Sheets */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Popular Sheets</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/sheet/striver" className="flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors w-fit">
                <BookOpen className="h-3.5 w-3.5" /> Striver's DSA Sheet
              </Link>
              <Link to="/sheet/lovebabbar" className="flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors w-fit">
                <BookOpen className="h-3.5 w-3.5" /> Love Babbar Sheet
              </Link>
              <Link to="/sheet/apnacollege" className="flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors w-fit">
                <BookOpen className="h-3.5 w-3.5" /> Apna College Sheet
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground/40 font-mono">
            © 2026 The DSA Manual. Built for learners.
          </p>
          <div className="flex gap-2">
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-card/50 text-foreground/60 transition-all hover:bg-card hover:text-foreground hover:-translate-y-0.5">
              <Github className="h-4 w-4" />
            </a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-card/50 text-foreground/60 transition-all hover:bg-card hover:text-foreground hover:-translate-y-0.5">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}