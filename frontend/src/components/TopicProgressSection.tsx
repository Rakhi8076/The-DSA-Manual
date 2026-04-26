import { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { sheets, getTopics, getQuestionsByTopic } from "@/data/sheets";
import { getConfidenceScore, getConfidenceEmoji, getConfidenceLabel } from "@/data/utils";
import { useProgress } from "@/hooks/useProgress";
import { useAIInsight } from "@/hooks/useAIInsight";

const TOPIC_ORDER = [
  "Basics", "Arrays", "Matrix", "Strings", "Sliding Window",
  "Searching & Sorting", "Recursion & Backtracking", "Linked List",
  "Stacks & Queues", "Binary Trees", "BST", "Heaps", "Graphs",
  "Dynamic Programming", "Greedy", "Tries", "Bit Manipulation",
  "Recursion", "Miscellaneous",
];

// Ring colors based on confidence
function getRingColor(score: number): string {
  if (score < 20) return "#ef4444";   // red
  if (score < 40) return "#f97316";   // orange
  if (score < 60) return "#eab308";   // yellow
  if (score < 80) return "#06b6d4";   // cyan (confident)
  return "#22c55e";                   // green (expert)
}

function CircularProgress({ pct, solved, total, score }: {
  pct: number; solved: number; total: number; score: number;
}) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * pct) / 100;
  const color = getRingColor(score);

  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 88 88">
        {/* Background ring */}
        <circle cx="44" cy="44" r={r} stroke="rgba(255,255,255,0.08)"
          strokeWidth="7" fill="transparent" />
        {/* Progress ring */}
        <motion.circle
          cx="44" cy="44" r={r}
          stroke={color} strokeWidth="7"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold text-white leading-none">{solved}</span>
        <span className="text-[10px] text-gray-400 leading-none mt-0.5">/{total}</span>
      </div>
    </div>
  );
}

export function TopicProgressSection() {
  const { isSolved } = useProgress();
  const { insights, loading, generateInsight } = useAIInsight();

  const mergedSheet = sheets.find(s => s.id === "common");
  const mergedQuestions = mergedSheet?.questions || [];

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

    const solvedEasy = solvedQuestions.filter(q => q.difficulty === "Easy").length;
    const totalEasy = questionsInTopic.filter(q => q.difficulty === "Easy").length;
    const solvedMedium = solvedQuestions.filter(q => q.difficulty === "Medium").length;
    const totalMedium = questionsInTopic.filter(q => q.difficulty === "Medium").length;
    const solvedHard = solvedQuestions.filter(q => q.difficulty === "Hard").length;
    const totalHard = questionsInTopic.filter(q => q.difficulty === "Hard").length;

    const allPatterns = [...new Set(questionsInTopic.map(q => q.pattern))];
    const solvedPatterns = [...new Set(solvedQuestions.map(q => q.pattern))];
    const unsolvedPatterns = allPatterns.filter(p => !solvedPatterns.includes(p));

    return {
      topic, solved: solvedCount, total, confidenceScore,
      emoji: getConfidenceEmoji(confidenceScore),
      label: getConfidenceLabel(confidenceScore),
      solvedEasy, totalEasy, solvedMedium, totalMedium, solvedHard, totalHard,
      solvedPatterns, unsolvedPatterns,
      hasSolved: solvedCount > 0,
      pct: total > 0 ? Math.round((solvedCount / total) * 100) : 0,
    };
  });

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
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Topic Progress</h2>
        <p className="text-xs text-gray-400">
          😰 Struggling · 😕 Learning · 😐 Getting There · 🙂 Confident · 😎 Expert
        </p>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topicStats.map(({ topic, solved, total, pct, confidenceScore, emoji, label, hasSolved }, i) => {
          const insight = insights[topic];
          const isLoading = loading[topic];
          const ringColor = getRingColor(confidenceScore);

          return (
            <motion.div
              key={topic}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="glass-card rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/5 transition-colors duration-200"
            >
              {/* Top row: emoji + topic name + label */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{emoji}</span>
                  <span className="text-sm font-semibold text-white">{topic}</span>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: `${ringColor}22`,
                    color: ringColor,
                    border: `1px solid ${ringColor}44`,
                  }}
                >
                  {label}
                </span>
              </div>

              {/* Circular Progress Ring — solved/total in center */}
              <CircularProgress
                pct={pct}
                solved={solved}
                total={total}
                score={confidenceScore}
              />

              {/* Confidence % bar */}
              <div>
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Confidence</span>
                  <span>{confidenceScore}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: ringColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${confidenceScore}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* AI Insight */}
              <div className="min-h-[32px]">
                {isLoading ? (
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                    <span className="text-[11px] text-gray-400 italic">
                      Analyzing...
                    </span>
                  </div>
                ) : insight ? (
                  <p className="text-[11px] italic leading-relaxed"
                    style={{ color: ringColor }}>
                    💡 {insight}
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-500 italic">
                    Solve questions to get AI insights
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
