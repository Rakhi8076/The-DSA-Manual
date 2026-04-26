import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SheetCard } from "@/components/SheetCard";
import { sheets } from "@/data/sheets";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Sparkles } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

export default function SheetsPage() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // Separate regular sheets and bonus sheet
  const regularSheets = sheets.filter(s => s.id !== "common");
  const bonusSheet = sheets.find(s => s.id === "common");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-1">
        <section id="sheets" className="scroll-mt-20">
          <div className="container py-10">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                Start Your DSA Practice
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Choose a sheet and track your progress as you learn.
              </p>
            </div>

            {/* Regular 3 sheets */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {regularSheets.map((sheet, i) => (
                <SheetCard key={sheet.id} sheet={sheet} index={i} isLoggedIn={isLoggedIn} />
              ))}
            </div>

            {/* Bonus Sheet — Full Width Banner */}
            {bonusSheet && (
              <BonusBanner sheet={bonusSheet} isLoggedIn={isLoggedIn} />
            )}

            {!isLoggedIn && (
              <div className="mt-10 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold text-sm shadow-lg shadow-accent/25 transition-all"
                >
                  🔓 Login to unlock tracking
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function BonusBanner({ sheet, isLoggedIn }: { sheet: any; isLoggedIn: boolean }) {
  const { getSolvedCount } = useProgress();
  const total = sheet.questions.length;
  const solved = isLoggedIn ? getSolvedCount(sheet.questions.map((q: any) => q.id)) : 0;
  const pct = isLoggedIn && total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="mt-6"
    >
      <Link
        to={`/sheet/${sheet.id}`}
        className="group block rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.12) 50%, rgba(6,182,212,0.10) 100%)",
          border: "1px solid rgba(139,92,246,0.35)",
          boxShadow: "0 0 40px rgba(139,92,246,0.1)",
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(6,182,212,0.06) 100%)",
          }}
        />

        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Left — Icon + Text */}
          <div className="flex items-start gap-4 flex-1">


            <div>
              {/* Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(251,191,36,0.15)",
                    border: "1px solid rgba(251,191,36,0.35)",
                    color: "#fbbf24",
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                  BONUS SHEET
                </span>

              </div>

              <h3 className="text-xl font-bold text-white mb-1">{sheet.name}</h3>
              <p className="text-xs font-mono mb-2" style={{ color: "hsl(243 75% 65%)" }}>
                {sheet.educator}
              </p>
              <p className="text-sm text-foreground/70 max-w-xl">{sheet.description}</p>
            </div>
          </div>

          {/* Right — Progress + CTA */}
          <div className="md:w-64 shrink-0">
            {isLoggedIn ? (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span className="text-foreground/80">{solved} / {total} solved</span>
                  <span className="font-mono text-foreground/80">{pct}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full progress-gradient"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-muted-foreground">🔒 Login to track progress</span>
              </div>
            )}

            <div
              className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all"
              style={{ color: "#a78bfa" }}
            >
              View Sheet <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}