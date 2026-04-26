import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";
import { motion } from "framer-motion";
import { sheets, getTopics, getQuestionsByTopic } from "@/data/sheets";
import { useProgress } from "@/hooks/useProgress";
import { TopicAccordion } from "@/components/TopicAccordion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

type DiffFilter = "All" | "Easy" | "Medium" | "Hard";

export default function SheetPage() {
  const { sheetId } = useParams<{ sheetId: string }>();
  const sheet = sheets.find(s => s.id === sheetId);
  const { user } = useAuth();
  const { getSolvedCount, isSolved } = useProgress();
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("All");

  const filteredQuestions = useMemo(() => {
    if (!sheet) return [];
    return sheet.questions.filter(q => {
      if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (diffFilter !== "All" && q.difficulty !== diffFilter) return false;
      return true;
    });
  }, [sheet, search, diffFilter, isSolved]);

  if (!sheet) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="container flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Sheet not found.</p>
        </div>
      </div>
    );
  }

  const total = sheet.questions.length;
  const solved = getSolvedCount(sheet.questions.map(q => q.id));
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  const easy = sheet.questions.filter(q => q.difficulty === "Easy");
  const medium = sheet.questions.filter(q => q.difficulty === "Medium");
  const hard = sheet.questions.filter(q => q.difficulty === "Hard");

  const easySolved = getSolvedCount(easy.map(q => q.id));
  const medSolved = getSolvedCount(medium.map(q => q.id));
  const hardSolved = getSolvedCount(hard.map(q => q.id));

  const TOPIC_ORDER = [
    "Basics", "Arrays", "Matrix", "Strings", "Sliding Window",
    "Searching & Sorting", "Recursion & Backtracking", "Linked List",
    "Stacks & Queues", "Binary Trees", "BST", "Heaps", "Graphs",
    "Dynamic Programming", "Greedy", "Tries", "Bit Manipulation",
    "Recursion", "Miscellaneous",
  ];

  const filteredTopics = getTopics(filteredQuestions).sort((a, b) => {
    if (sheet.id !== "common") return 0;
    const ai = TOPIC_ORDER.indexOf(a);
    const bi = TOPIC_ORDER.indexOf(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const diffFilters: DiffFilter[] = ["All", "Easy", "Medium", "Hard"];

  const diffColors: Record<string, string> = {
    All: "bg-accent text-accent-foreground",
    Easy: "bg-success/15 text-success border-success/30",
    Medium: "bg-warning/15 text-warning border-warning/30",
    Hard: "bg-destructive/15 text-destructive border-destructive/30",
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 gradient-bg tech-grid-bg">
        <div className="container py-8 md:py-12">

          <Link
            to="/sheets"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
            style={{
              transform: "translateY(-20px)",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "hsl(var(--foreground))",
              backdropFilter: "blur(8px)",
              boxShadow: "0 1px 12px rgba(0,0,0,0.2)",
            }}
          >
            Back
          </Link>

          {!user && <LoginPromptBanner />}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-1 text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              {sheet.name}
            </h1>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                  Overall Progress
                </span>
                <span className="text-sm text-foreground/70" style={{ fontFamily: "var(--font-mono)" }}>
                  {solved}/{total} ({pct}%)
                </span>
              </div>

              {/* ✅ CSS transition — motion nahi */}
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted/40 mb-5">
                <div
                  className="h-full rounded-full progress-gradient transition-all duration-500 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <DiffStat label="Easy" solved={easySolved} total={easy.length} colorClass="text-success" barClass="bg-success" />
                <DiffStat label="Medium" solved={medSolved} total={medium.length} colorClass="text-warning" barClass="bg-warning" />
                <DiffStat label="Hard" solved={hardSolved} total={hard.length} colorClass="text-destructive" barClass="bg-destructive" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                placeholder="Search questions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-card/60 backdrop-blur-md py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {diffFilters.map(f => (
                <button
                  key={f}
                  onClick={() => setDiffFilter(f)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    diffFilter === f ? diffColors[f] : "border-border bg-card/50 text-foreground hover:bg-card/70"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="space-y-3">
            {filteredTopics.length > 0 ? (
              filteredTopics.map(topic => (
                <TopicAccordion
                  key={topic}
                  topic={topic}
                  questions={getQuestionsByTopic(filteredQuestions, topic)}
                />
              ))
            ) : (
              <div className="glass-card rounded-2xl p-8 text-center text-muted-foreground text-sm">
                No questions match your filters.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function LoginPromptBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
      style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.10))",
        border: "1px solid rgba(139,92,246,0.3)",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">🔓</span>
        <div>
          <p className="text-sm font-semibold text-white">Save your progress permanently!</p>
          <p className="text-xs text-gray-400">
            Login to sync across devices, get AI insights & use the AlgoShee chatbot.
          </p>
        </div>
      </div>
      <Link
        to="/login"
        className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
        style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          boxShadow: "0 4px 15px rgba(139,92,246,0.4)",
        }}
      >
        Login / Sign Up →
      </Link>
    </motion.div>
  );
}

function DiffStat({ label, solved, total, colorClass, barClass }: {
  label: string; solved: number; total: number; colorClass: string; barClass: string;
}) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <div className="text-center">
      <span className={`text-xs font-semibold ${colorClass} border border-black/40 rounded px-1.5 py-0.5`}
        style={{ fontFamily: "var(--font-mono)" }}>
        {label}
      </span>
      <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
        {solved}<span className="text-foreground/60 font-normal text-sm">/{total}</span>
      </p>
      {/* ✅ CSS transition */}
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted/40">
        <div
          className={`h-full rounded-full ${barClass} transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}