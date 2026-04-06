import { motion } from "framer-motion";
import { ArrowRight, Flame, Heart, GraduationCap, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet } from "@/data/sheets";
import { useProgress } from "@/hooks/useProgress";

const sheetIcons: Record<string, React.ElementType> = {
  striver: Flame,
  lovebabbar: Heart,
  apnacollege: GraduationCap,
  common: Brain,
};

interface SheetCardProps {
  sheet: Sheet;
  index: number;
  isLoggedIn?: boolean;
}

export function SheetCard({ sheet, index, isLoggedIn = false }: SheetCardProps) {
  const { getSolvedCount } = useProgress();
  const total = sheet.questions.length;
  const solved = isLoggedIn ? getSolvedCount(sheet.questions.map(q => q.id)) : 0;
  const pct = isLoggedIn && total > 0 ? Math.round((solved / total) * 100) : 0;
  const Icon = sheetIcons[sheet.id] || Brain;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/sheet/${sheet.id}`}
        className="group block rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 glass-card"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
          <Icon className="h-6 w-6 text-accent" />
        </div>
        <h3 className="mb-1 text-lg font-bold font-display text-white">{sheet.name}</h3>
        <p className="mb-1 text-xs font-medium font-mono" style={{ color: "hsl(243 75% 55%)" }}>{sheet.educator}</p>
        <p className="mb-4 text-sm text-foreground/80 leading-relaxed line-clamp-2">{sheet.description}</p>

        <div className="mb-2 text-xs text-foreground/70 font-mono">{total} questions</div>
        {isLoggedIn ? (
          <div className="mb-4">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span className="text-foreground/80">{solved} / {total} solved</span>
              <span className="font-mono text-foreground/80">{pct}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full progress-gradient transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-secondary/50 border border-border/30">
            <span className="text-xs text-muted-foreground">🔒 Login to track progress</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-sm font-medium group-hover:gap-2.5 transition-all" style={{ color: "hsl(243 75% 55%)" }}>
          {isLoggedIn ? (
            <>View Sheet <ArrowRight className="h-3.5 w-3.5" /></>
          ) : (
            <span className="text-muted-foreground">
              Login to unlock →
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
