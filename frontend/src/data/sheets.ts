export type { Question, Sheet } from "./types";
export { getTopics, getQuestionsByTopic, getSections, getQuestionsBySection } from "./utils";

import { Sheet } from "./types";
import { striverQuestions } from "./striverSheet";
import { lovebabbarQuestions } from "./lovebabbarSheet";
import { apnaQuestions } from "./apnaSheet";
import { mergedQuestions } from "./mergedSheet";

export const sheets: Sheet[] = [
  {
    id: "striver",
    name: "Striver's DSA Sheet",
    educator: "Striver",
    description: "A comprehensive DSA sheet covering all major topics for coding interviews.",
    icon: "🔥",
    questions: striverQuestions,
  },
  {
    id: "lovebabbar",
    name: "Love Babbar DSA Sheet",
    educator: "Love Babbar",
    description: "450 DSA questions curated for cracking top product-based company interviews.",
    icon: "💛",
    questions: lovebabbarQuestions,
  },
  {
    id: "apnacollege",
    name: "Apna College DSA Sheet",
    educator: "Apna College",
    description: "Beginner-friendly DSA sheet perfect for college students starting their coding journey.",
    icon: "🎓",
    questions: apnaQuestions,
  },
  {
    id: "common",
    name: "The DSA Manual Sheet",
    educator: "Striver + Love Babbar + Apna College",
    description: "All questions from all three sheets merged and deduplicated into one master sheet.",
    icon: "📚",
    questions: mergedQuestions,
  },
];