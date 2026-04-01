import { Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/20 bg-background/80 backdrop-blur-md">
      <div className="container py-10 space-y-8">

        {/* Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="text-center sm:text-left">
            <p className="text-base font-semibold tracking-tight">
              The DSA Manual
            </p>
            <p className="text-xs text-foreground/50">
              Master DSA • Track Progress • Stay Consistent
            </p>
          </div>

          {/* Contributors */}
          <div className="flex flex-col gap-2 text-sm">

            {/* Rachita */}
            <a
              href="https://www.linkedin.com/in/rachitaj28/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition"
            >
              <Linkedin className="h-4 w-4" />
              <span className="hover:underline">Rachita Jain</span>
            </a>

            {/* Rakhi */}
            <a
              href="https://www.linkedin.com/in/rakhi-41a351283/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition"
            >
              <Linkedin className="h-4 w-4" />
              <span className="hover:underline">Rakhi</span>
            </a>

          </div>

        </div>

        {/* Divider (Premium) */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Bottom */}
        <div className="text-center text-sm text-foreground/60 font-medium tracking-wide">
          © 2026 The DSA Manual • Built with
          <span className="text-red-500 mx-1 text-base">♥</span>
          by <span className="font-semibold text-foreground">R2</span>
        </div>

      </div>
    </footer>
  );
}