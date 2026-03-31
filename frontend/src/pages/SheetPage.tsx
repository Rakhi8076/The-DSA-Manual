import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Search, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { sheets, getTopics, getQuestionsByTopic } from "@/data/sheets";
import { useProgress } from "@/hooks/useProgress";
import { TopicAccordion } from "@/components/TopicAccordion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type DiffFilter = "All" | "Easy" | "Medium" | "Hard";
type StatusFilter = "All" | "Solved" | "Unsolved";

export default function SheetPage() {
  const { sheetId } = useParams<{ sheetId: string }>();
  const sheet = sheets.find(s => s.id === sheetId);
  const { getSolvedCount, isSolved } = useProgress();
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const filteredQuestions = useMemo(() => {
    if (!sheet) return [];
    return sheet.questions.filter(q => {
      if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (diffFilter !== "All" && q.difficulty !== diffFilter) return false;
      if (statusFilter === "Solved" && !isSolved(q.id)) return false;
      if (statusFilter === "Unsolved" && isSolved(q.id)) return false;
      return true;
    });
  }, [sheet, search, diffFilter, statusFilter, isSolved]);

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

  const filteredTopics = getTopics(filteredQuestions);
  const nextUnsolved = sheet.questions.find(q => !isSolved(q.id));

  const diffFilters: DiffFilter[] = ["All", "Easy", "Medium", "Hard"];
  const statusFilters: StatusFilter[] = ["All", "Solved", "Unsolved"];

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
          {/* Back link */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Sheets
            </Link>
          </motion.div>

          {/* Sheet header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-1 text-foreground" style={{ fontFamily: "var(--font-display)" }}>{sheet.name}</h1>
            <p className="text-muted-foreground text-sm mb-2" style={{ fontFamily: "var(--font-mono)" }}>{sheet.educator}</p>
            <p className="text-muted-foreground text-sm mb-6">{total} questions total</p>

            {/* Difficulty distribution */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-success/20 bg-success/10 px-3 py-1.5 text-sm font-medium text-success">
                Easy <span className="font-bold" style={{ fontFamily: "var(--font-mono)" }}>{easy.length}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-warning/20 bg-warning/10 px-3 py-1.5 text-sm font-medium text-warning">
                Medium <span className="font-bold" style={{ fontFamily: "var(--font-mono)" }}>{medium.length}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive">
                Hard <span className="font-bold" style={{ fontFamily: "var(--font-mono)" }}>{hard.length}</span>
              </span>
            </div>

            {/* Overall progress */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Overall Progress</span>
                <span className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>{solved}/{total} ({pct}%)</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted/40 mb-5">
                <motion.div
                  className="h-full rounded-full progress-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <DiffStat label="Easy" solved={easySolved} total={easy.length} colorClass="text-success" barClass="bg-success" />
                <DiffStat label="Medium" solved={medSolved} total={medium.length} colorClass="text-warning" barClass="bg-warning" />
                <DiffStat label="Hard" solved={hardSolved} total={hard.length} colorClass="text-destructive" barClass="bg-destructive" />
              </div>
            </div>
          </motion.div>

          {/* Continue Solving */}
          {nextUnsolved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 glass-card rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-accent font-semibold mb-0.5" style={{ fontFamily: "var(--font-mono)" }}>Continue Solving</p>
                <p className="text-sm font-medium text-gray-900 truncate">{nextUnsolved.title}</p>
              </div>
              <a
                href={nextUnsolved.leetcode || nextUnsolved.gfg}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
              >
                Solve Now
              </a>
            </motion.div>
          )}

          {/* Search & Filters */}
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
                    diffFilter === f
                      ? diffColors[f]
                      : "border-border bg-card/50 text-foreground hover:bg-card/70"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {f}
                </button>
              ))}
              <div className="w-px bg-white/30 mx-1" />
              {statusFilters.map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    statusFilter === f
                      ? "bg-accent text-accent-foreground border-gray-900"
                      : "border-border bg-card/50 text-foreground hover:bg-card/70"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Topic accordions */}
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

function DiffStat({ label, solved, total, colorClass, barClass }: { label: string; solved: number; total: number; colorClass: string; barClass: string }) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <div className="text-center">
      <span className={`text-xs font-semibold ${colorClass}`} style={{ fontFamily: "var(--font-mono)" }}>{label}</span>
      <p className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{solved}<span className="text-muted-foreground font-normal text-sm">/{total}</span></p>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted/40">
        <motion.div
          className={`h-full rounded-full ${barClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </div>
    </div>
  );
}
