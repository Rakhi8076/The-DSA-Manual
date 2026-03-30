import { Github, Linkedin, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <Code2 className="h-4 w-4 text-accent" />
            </div>
            <span className="text-lg font-bold font-display">DSA Sheets Hub</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
            Practice curated DSA sheets and track your coding progress.
          </p>
          <div className="flex gap-3">
            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background transition-all hover:bg-secondary hover:-translate-y-0.5">
              <Github className="h-4 w-4" />
            </a>
            <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background transition-all hover:bg-secondary hover:-translate-y-0.5">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            © 2026 DSA Sheets Hub. Built for learners.
          </p>
        </div>
      </div>
    </footer>
  );
}
