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
    leetcode: q.leetcode || "",
    gfg: "",
    topic: q.topic,
    section: q.section || q.topic,
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