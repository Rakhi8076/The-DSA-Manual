import { useMemo } from "react";
import { motion } from "framer-motion";

interface PracticeHeatmapProps {
  solvedDates: string[]; // ISO date strings
}

export function PracticeHeatmap({ solvedDates }: PracticeHeatmapProps) {
  const weeks = useMemo(() => {
    const today = new Date();
    const result: { date: string; count: number; level: number }[][] = [];
    const dateCounts: Record<string, number> = {};

    solvedDates.forEach(d => {
      const key = d.slice(0, 10);
      dateCounts[key] = (dateCounts[key] || 0) + 1;
    });

    // Generate 20 weeks of data
    for (let w = 19; w >= 0; w--) {
      const week: { date: string; count: number; level: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
        const key = date.toISOString().slice(0, 10);
        const count = dateCounts[key] || 0;
        const level = count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4;
        week.push({ date: key, count, level });
      }
      result.push(week);
    }
    return result;
  }, [solvedDates]);

  const levelColors = [
    "bg-secondary",
    "bg-primary/25",
    "bg-primary/45",
    "bg-primary/70",
    "bg-primary",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-5 shadow-card"
    >
      <h3 className="text-sm font-semibold font-display mb-4">Practice Activity</h3>
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.date}
                className={`h-3 w-3 rounded-sm ${levelColors[day.level]} transition-colors`}
                title={`${day.date}: ${day.count} solved`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        {levelColors.map((c, i) => (
          <div key={i} className={`h-3 w-3 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </motion.div>
  );
}
