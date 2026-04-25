import { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { sheets, getTopics, getQuestionsByTopic } from "@/data/sheets";
import { getConfidenceScore, getConfidenceEmoji, getConfidenceLabel } from "@/data/utils";
import { useProgress } from "@/hooks/useProgress";
import { useAIInsight } from "@/hooks/useAIInsight";

export function TopicProgressSection() {
  const { isSolved } = useProgress();
  const { insights, loading, generateInsight } = useAIInsight();

  const mergedSheet = sheets.find(s => s.id === "common");
  const mergedQuestions = mergedSheet?.questions || [];
  const TOPIC_ORDER = [
  "Basics",
  "Arrays",
  "Matrix",
  "Strings",
  "Sliding Window",
  "Searching & Sorting",
  "Recursion & Backtracking",
  "Linked List",
  "Stacks & Queues",
  "Binary Trees",
  "BST",
  "Heaps",
  "Graphs",
  "Dynamic Programming",
  "Greedy",
  "Tries",
  "Bit Manipulation",
  "Recursion",
  "Miscellaneous",
];

const topics = getTopics(mergedQuestions).sort((a, b) => {
  const ai = TOPIC_ORDER.indexOf(a);
  const bi = TOPIC_ORDER.indexOf(b);
  if (ai === -1) return 1;
  if (bi === -1) return -1;
  return ai - bi;
});

  const topicStats = topics.map(topic => {
    const questionsInTopic = getQuestionsByTopic(mergedQuestions, topic);
    const solvedQuestions = questionsInTopic.filter(q => isSolved(q.id));
    const solvedCount = solvedQuestions.length;
    const total = questionsInTopic.length;
    const confidenceScore = getConfidenceScore(questionsInTopic, isSolved);

    // Difficulty breakdown
    const solvedEasy = solvedQuestions.filter(q => q.difficulty === "Easy").length;
    const totalEasy = questionsInTopic.filter(q => q.difficulty === "Easy").length;
    const solvedMedium = solvedQuestions.filter(q => q.difficulty === "Medium").length;
    const totalMedium = questionsInTopic.filter(q => q.difficulty === "Medium").length;
    const solvedHard = solvedQuestions.filter(q => q.difficulty === "Hard").length;
    const totalHard = questionsInTopic.filter(q => q.difficulty === "Hard").length;

    //Pattern breakdown
    const allPatterns = [...new Set(questionsInTopic.map(q => q.pattern))];
    const solvedPatterns = [...new Set(solvedQuestions.map(q => q.pattern))];
    const unsolvedPatterns = allPatterns.filter(p => !solvedPatterns.includes(p));

    return {
      topic,
      solved: solvedCount,
      total,
      confidenceScore,
      emoji: getConfidenceEmoji(confidenceScore),
      label: getConfidenceLabel(confidenceScore),
      solvedEasy, totalEasy,
      solvedMedium, totalMedium,
      solvedHard, totalHard,
      solvedPatterns,
      unsolvedPatterns,
      hasSolved: solvedCount > 0,
    };
  });

  // Auto-generate insights for topics where something is solved
  const solvedKey = topicStats.map(s => `${s.topic}:${s.solved}`).join("|");

useEffect(() => {
  topicStats.forEach(stat => {
    if (stat.hasSolved) {
      generateInsight({
        topic: stat.topic,
        solvedEasy: stat.solvedEasy,
        totalEasy: stat.totalEasy,
        solvedMedium: stat.solvedMedium,
        totalMedium: stat.totalMedium,
        solvedHard: stat.solvedHard,
        totalHard: stat.totalHard,
        solvedPatterns: stat.solvedPatterns,
        unsolvedPatterns: stat.unsolvedPatterns,
      });
    }
  });
}, [solvedKey]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="rounded-2xl bg-white/10 p-6"
    >
      <h3 className="text-lg font-bold mb-2 text-foreground" style={{ fontFamily: "var(--font-display)" }}>
        Topic Progress 
      </h3>
      <p className="text-xs text-gray-400 mb-5" style={{ fontFamily: "var(--font-mono)" }}>
        😰 Struggling · 😕 Learning · 😐 Getting There · 🙂 Confident · 😎 Expert
      </p>

      <div className="space-y-5">
        {topicStats.map(({ topic, solved, total, confidenceScore, emoji, label, hasSolved }) => {
          const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
          const insight = insights[topic];
          const isLoading = loading[topic];

          return (
            <div key={topic}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {/* Emoji replaces icon */}
                  <span
                    className="text-xl"
                    title={`${label} (${confidenceScore}% confidence)`}
                  >
                    {emoji}
                  </span>
                  <span className="text-sm font-medium text-foreground">{topic}</span>
                  {/* Confidence label badge */}
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted/40 text-muted-foreground"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {label}
                  </span>
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {solved} / {total} solved
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/40">
                <motion.div
                  className="h-full rounded-full progress-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              {/* AI Insight line */}
              <div className="mt-1.5 min-h-[18px]">
                {isLoading ? (
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground italic">
                      Analyzing your progress...
                    </span>
                  </div>
                ) : insight ? (
                  <p
                    className="text-[11px] italic"
                    style={{ color: "hsl(243 80% 75%)" }}
                  >
                    💡 {insight}
                  </p>
                ) : !hasSolved ? (
                  <p className="text-[11px] italic" style={{ color: "lightblue"}}>
                    Solve some questions to get AI insights
                  </p>
                ) : null}
              </div>

              {/* Confidence score small text */}
              <div className="flex justify-end mt-0.5">
                <span
                  className="text-[10px] text-white/80"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  confidence: {confidenceScore}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

