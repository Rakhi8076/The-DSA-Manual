import { motion } from "framer-motion";
import { sheets, getTopics, getQuestionsByTopic } from "@/data/sheets";
import { useProgress } from "@/hooks/useProgress";
import { Grid3X3, Type, GitBranch, Network, Layers, Search, Binary, ListOrdered, LayoutList } from "lucide-react";

const topicIcons: Record<string, React.ElementType> = {
  "Arrays": Grid3X3,
  "Strings": Type,
  "Trees": GitBranch,
  "Graphs": Network,
  "Stack & Queue": Layers,
  "Binary Search": Search,
  "Dynamic Programming": Binary,
  "Sorting": ListOrdered,
  "Linked List": LayoutList,
};

export function TopicProgressSection() {
  const { isSolved } = useProgress();

  // Aggregate all questions across all sheets by topic
  const allQuestions = sheets.flatMap(s => s.questions);
  const topics = getTopics(allQuestions);

  // Deduplicate by base question title+topic to avoid counting same question across sheets multiple times
  const topicStats = topics.map(topic => {
    const questionsInTopic = getQuestionsByTopic(allQuestions, topic);
    const totalIds = questionsInTopic.map(q => q.id);
    const solvedCount = totalIds.filter(id => isSolved(id)).length;
    return { topic, solved: solvedCount, total: totalIds.length };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="rounded-2xl glass-card p-6"
    >
      <h3 className="text-lg font-bold mb-5" style={{ fontFamily: "var(--font-display)" }}>
        Topic Progress (All Sheets)
      </h3>
      <div className="space-y-4">
        {topicStats.map(({ topic, solved, total }) => {
          const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
          const Icon = topicIcons[topic] || Grid3X3;
          return (
            <div key={topic}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">{topic}</span>
                </div>
                <span className="text-xs font-medium" style={{ color: "hsl(220 70% 50%)" }} style={{ fontFamily: "var(--font-mono)" }}>
                  {solved} / {total} solved
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/40">
                <motion.div
                  className="h-full rounded-full progress-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
