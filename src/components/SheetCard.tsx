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
}

export function SheetCard({ sheet, index }: SheetCardProps) {
  const { getSolvedCount } = useProgress();
  const total = sheet.questions.length;
  const solved = getSolvedCount(sheet.questions.map(q => q.id));
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  const Icon = sheetIcons[sheet.id] || Brain;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/sheet/${sheet.id}`}
        className="group block rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
          <Icon className="h-6 w-6 text-accent" />
        </div>
        <h3 className="mb-1 text-lg font-bold font-display">{sheet.name}</h3>
        <p className="mb-1 text-xs font-medium text-accent font-mono">{sheet.educator}</p>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed line-clamp-2">{sheet.description}</p>

        <div className="mb-2 text-xs text-muted-foreground font-mono">{total} questions</div>
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>{solved} / {total} solved</span>
            <span className="font-mono">{pct}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full progress-gradient transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm font-medium text-accent group-hover:gap-2.5 transition-all">
          View Sheet <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </Link>
    </motion.div>
  );
}
