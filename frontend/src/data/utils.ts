import { Question } from "./types";

export function capitalize(s: string): "Easy" | "Medium" | "Hard" {
  const lower = s.toLowerCase();
  if (lower === "hard") return "Hard";
  if (lower === "medium") return "Medium";
  return "Easy";
}

export function convertQuestions(data: any[], prefix: string): Question[] {
  return data.map(q => ({
    id: `${prefix}_${q.id}`,
    title: q.question,
    difficulty: capitalize(q.difficulty),

    // 🔥 MOST IMPORTANT FIX
    link: q.link || q.leetcode || q.gfg || "",

    leetcode: q.leetcode || "",
    gfg: q.gfg || "",

    topic: q.topic && !["Easy", "Medium", "Hard"].includes(q.topic)
      ? q.topic
      : "General",
    section: q.section || q.topic,
    pattern: q.pattern || "General",
  }));
}

export function getTopics(questions: Question[]): string[] {
  return [...new Set(questions.map(q => q.topic))];
}

export function getQuestionsByTopic(questions: Question[], topic: string): Question[] {
  return questions.filter(q => q.topic === topic);
}

export function getSections(questions: Question[]): string[] {
  return [...new Set(questions.map(q => q.section))];
}

export function getQuestionsBySection(questions: Question[], section: string): Question[] {
  return questions.filter(q => q.section === section);
}

// Confidence calculation
const DIFFICULTY_POINTS: Record<string, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

export function getConfidenceScore(
  questions: Question[],
  isSolved: (id: string) => boolean
): number {
  if (questions.length === 0) return 0;

  // Difficulty Score (60% weightage)
  let totalPoints = 0;
  let earnedPoints = 0;

  questions.forEach(q => {
    const pts = DIFFICULTY_POINTS[q.difficulty] || 1;
    totalPoints += pts;
    if (isSolved(q.id)) earnedPoints += pts;
  });

  const difficultyScore = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

  // Pattern Coverage Score (40% weightage)
  const allPatterns = new Set(questions.map(q => q.pattern));
  const solvedPatterns = new Set(
    questions.filter(q => isSolved(q.id)).map(q => q.pattern)
  );

  const patternScore = allPatterns.size > 0
    ? (solvedPatterns.size / allPatterns.size) * 100
    : 0;

  // Final combined score
  return Math.round(difficultyScore * 0.6 + patternScore * 0.4);
}

export function getConfidenceEmoji(score: number): string {
  if (score < 20) return "😰";
  if (score < 40) return "😕";
  if (score < 60) return "😐";
  if (score < 80) return "🙂";
  return "😎";
}

export function getConfidenceLabel(score: number): string {
  if (score < 20) return "Struggling";
  if (score < 40) return "Learning";
  if (score < 60) return "Getting There";
  if (score < 80) return "Confident";
  return "Expert";
}