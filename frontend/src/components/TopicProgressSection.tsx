import { motion } from "framer-motion";
import { sheets, getTopics, getQuestionsByTopic } from "@/data/sheets";
import { getConfidenceScore, getConfidenceEmoji, getConfidenceLabel } from "@/data/utils";
import { useProgress } from "@/hooks/useProgress";

export function TopicProgressSection() {
  const { isSolved } = useProgress();

  const allQuestions = sheets.flatMap(s => s.questions);
  const topics = getTopics(allQuestions);

  const topicStats = topics.map(topic => {
    const questionsInTopic = getQuestionsByTopic(allQuestions, topic);
    const totalIds = questionsInTopic.map(q => q.id);
    const solvedCount = totalIds.filter(id => isSolved(id)).length;
    const confidenceScore = getConfidenceScore(questionsInTopic, isSolved);
    const emoji = getConfidenceEmoji(confidenceScore);
    const label = getConfidenceLabel(confidenceScore);

    return {
      topic,
      solved: solvedCount,
      total: totalIds.length,
      confidenceScore,
      emoji,
      label,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="rounded-2xl glass-card p-6"
    >
      <h3 className="text-lg font-bold mb-2 text-foreground" style={{ fontFamily: "var(--font-display)" }}>
        Topic Progress (All Sheets)
      </h3>
      <p className="text-xs text-black mb-5" style={{ fontFamily: "var(--font-mono)" }}>
        😰 Struggling &nbsp;·&nbsp; 😕 Learning &nbsp;·&nbsp; 😐 Getting There &nbsp;·&nbsp; 🙂 Confident &nbsp;·&nbsp; 😎 Expert
      </p>

      <div className="space-y-4">
        {topicStats.map(({ topic, solved, total, confidenceScore, emoji, label }) => {
          const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
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
                  style={{ color: "black", fontFamily: "var(--font-mono)" }}
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

