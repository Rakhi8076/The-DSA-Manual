import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TopicProgressSection } from "@/components/TopicProgressSection";
import { sheets } from "@/data/sheets";
import { useProgress } from "@/hooks/useProgress";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getSolvedCount } = useProgress();

  const mergedSheet = sheets.find(s => s.id === "common");
  const allQuestions = mergedSheet?.questions || [];

  const total    = allQuestions.length;
  const easy     = allQuestions.filter(q => q.difficulty === "Easy");
  const medium   = allQuestions.filter(q => q.difficulty === "Medium");
  const hard     = allQuestions.filter(q => q.difficulty === "Hard");

  const solved      = getSolvedCount(allQuestions.map(q => q.id));
  const easyCount   = getSolvedCount(easy.map(q => q.id));
  const mediumCount = getSolvedCount(medium.map(q => q.id));
  const hardCount   = getSolvedCount(hard.map(q => q.id));

  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  const circumference = 2 * Math.PI * 60;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container py-1">
        <div className="container py-10">

          {/* Back button */}
          <button
            onClick={() => navigate("/sheets")}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold mb-6 transition-all hover:-translate-y-0.5 glass-card"
          >
            Back
          </button>

          <h1 className="text-2xl md:text-3xl font-extrabold mb-8 text-foreground">
            Dashboard
          </h1>

          {/* Profile + Progress side by side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-lg font-bold mb-6 text-foreground">Profile</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Name</p>
                  <p className="text-sm font-semibold text-foreground">{user?.name || "Guest"}</p>
                </div>
                <div className="h-px bg-border/30" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-medium text-foreground break-all">{user?.email || "Not available"}</p>
                </div>
                <div className="h-px bg-border/30" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Solved</p>
                  <p className="text-2xl font-bold text-foreground">
                    {solved}
                    <span className="text-sm text-muted-foreground font-normal"> / {total}</span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Progress Card — spans 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6 md:col-span-2"
            >
              <h2 className="text-lg font-bold mb-6 text-foreground">Progress</h2>
              <div className="flex items-center justify-center gap-10">

                {/* Circular ring */}
                <div className="relative w-36 h-36 shrink-0">
                  <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 144 144">
                    <circle cx="72" cy="72" r="60" stroke="white"
                      strokeWidth="8" fill="transparent" opacity="0.1" />
                    <circle cx="72" cy="72" r="60" stroke="cyan"
                      strokeWidth="8" fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (circumference * solved) / total}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-white leading-none">
                      {pct}<span className="text-sm font-normal">%</span>
                    </p>
                    <p className="text-green-400 text-xs mt-1">Solved</p>
                  </div>
                </div>

                {/* Easy / Medium / Hard bars */}
                <div className="flex flex-col gap-4 flex-1 min-w-0">
                  {[
                    { label: "Easy",   count: easyCount,   total: easy.length,   color: "#4ade80", bg: "rgba(74,222,128,0.15)" },
                    { label: "Medium", count: mediumCount, total: medium.length, color: "#facc15", bg: "rgba(250,204,21,0.15)" },
                    { label: "Hard",   count: hardCount,   total: hard.length,   color: "#f87171", bg: "rgba(248,113,113,0.15)" },
                  ].map(({ label, count, total: t, color, bg }) => (
                    <div key={label} className="rounded-xl px-4 py-3" style={{ background: bg }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold" style={{ color }}>{label}</span>
                        <span className="text-xs text-muted-foreground font-mono">{count} / {t}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${t > 0 ? (count / t) * 100 : 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Topic Progress */}
          <TopicProgressSection />

        </div>
      </main>

      <Footer />
    </div>
  );
}