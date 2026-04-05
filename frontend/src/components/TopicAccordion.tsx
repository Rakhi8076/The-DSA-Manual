import { useState } from "react";
import { ChevronDown, ExternalLink, Check, Grid3X3, Type, GitBranch, Network, Layers, Search, Binary, ListOrdered, LayoutList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/data/sheets";
import { useProgress } from "@/hooks/useProgress";

interface TopicAccordionProps {
  topic: string;
  questions: Question[];
}

const topicIcons: Record<string, React.ElementType> = {
  "Arrays": Grid3X3,
  "Strings": Type,
  "Trees": GitBranch,
  "Binary Trees": GitBranch,
  "BST": Search,
  "Graphs": Network,
  "Stack & Queue": Layers,
  "Stacks & Queues": Layers,
  "Binary Search": Search,
  "Dynamic Programming": Binary,
  "Sorting": ListOrdered,
  "Linked List": LayoutList,
};

const difficultyStyles: Record<string, string> = {
  Easy: "bg-success/20 text-success border-success/40",
  Medium: "bg-warning/20 text-warning border-warning/40",
  Hard: "bg-destructive/20 text-red-400 border-destructive/40",
};

function getPracticeLink(q: Question): { url: string; label: string } {
  if (q.link && q.link !== "") return { url: q.link, label: "Practice" }; // ✅ NEW
  if (q.leetcode && q.leetcode !== "") return { url: q.leetcode, label: "Practice" };
  if (q.gfg && q.gfg !== "") return { url: q.gfg, label: "Practice" };
  return { url: "#", label: "No Link" }; // ✅ safety
}

// Section accordion inside topic
function SectionAccordion({ section, questions }: { section: string; questions: Question[] }) {
  const [open, setOpen] = useState(false);
  const { isSolved, toggleSolved } = useProgress();

  return (
    <div className="border-b border-border/20 last:border-b-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-5 py-3 text-left hover:bg-card/20 transition-colors"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-foreground/70">{section}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">{questions.length} questions</span>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[40px_1fr_120px_100px_100px] gap-2 px-5 py-2 text-xs font-medium text-foreground/70 uppercase tracking-wider border-t border-border/20 bg-muted/20">
              <span></span>
              <span>Question</span>
              <span>Difficulty</span>
              <span>Practice</span>
              <span>Status</span>
            </div>

            {questions.map(q => {
              const qSolved = isSolved(q.id);
              const link = getPracticeLink(q);
              return (
                <div
                  key={q.id}
                  className={`grid grid-cols-1 sm:grid-cols-[40px_1fr_120px_100px_100px] gap-2 items-center px-5 py-3.5 border-t border-border/10 text-sm transition-colors hover:bg-card/30 ${qSolved ? "bg-success/5" : ""}`}
                >
                  
                  <button
                    onClick={() => toggleSolved(q.id)}
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${qSolved
                      ? "border-success bg-success shadow-sm shadow-success/25"
                      : "border-foreground/60 hover:border-accent"
                      }`}
                  >
                    {qSolved && <Check className="h-3 w-3 text-white" />}
                  </button>

                  <span className={`font-medium ${qSolved ? "line-through text-foreground/50" : "text-foreground"}`}>
                    {q.title || (q as any).question}
                  </span>

                  <span
                    className={`inline-flex w-fit items-center rounded-md border px-2.5 py-0.5 text-xs font-bold ${difficultyStyles[q.difficulty]}`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {q.difficulty}
                  </span>


                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!link.url || link.url === "#") {
                        e.preventDefault();
                        alert("Link not available");
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                    style={{ color: "hsl(243 80% 88%)" }}
                  >
                    {link.label} <ExternalLink className="h-3 w-3" />
                  </a>

                  <span
                    className={`text-xs font-medium ${qSolved ? "text-success" : "text-foreground/80"}`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {qSolved ? "Solved" : "Unsolved"}
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TopicAccordion({ topic, questions }: TopicAccordionProps) {
  const [open, setOpen] = useState(false);
  const { getSolvedCount } = useProgress();
  const solved = getSolvedCount(questions.map(q => q.id));
  const pct = Math.round((solved / questions.length) * 100);
  const Icon = topicIcons[topic] || Grid3X3;

  // Group questions by section
  const sections = [...new Set(questions.map(q => q.section))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/10"
    >
      {/* Topic header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between gap-4 p-4 md:p-5 text-left transition-colors hover:bg-card/20"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/30">
            <Icon className="h-4 w-4 text-foreground/80" />
          </div>
          <span className="text-sm font-semibold text-foreground truncate" style={{ fontFamily: "var(--font-display)" }}>
            {topic}
          </span>

        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 w-36">
            <div className="h-2 flex-1 rounded-full bg-muted/40 overflow-hidden">
              <div className="h-full rounded-full progress-gradient transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-white font-medium w-12 text-right" style={{ fontFamily: "var(--font-mono)" }}>
              {solved}/{questions.length}
            </span>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Sections */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border/30"
          >
            {sections.map(section => (
              <SectionAccordion
                key={section}
                section={section}
                questions={questions.filter(q => q.section === section)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}