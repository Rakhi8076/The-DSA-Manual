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
    name: "TUF AtoZ",
    educator: "Striver",
    description: "Striver's handpicked DSA problems — trusted by lakhs of students for FAANG prep.",
    icon: "🔥",
    questions: striverQuestions,
  },
  {
    id: "lovebabbar",
    name: "codeHelp",
    educator: "Love Babbar",
    description: "Love Babbar's 450 DSA questions — the go-to sheet for product-based company interviews.",
    icon: "💛",
    questions: lovebabbarQuestions,
  },
  {
    id: "apnacollege",
    name: "Apna College",
    educator: "Shradha Khapra",
    description: "Shradha Khapra's beginner-friendly sheet — perfect for college students starting DSA.",
    icon: "🎓",
    questions: apnaQuestions,
  },
  {
    id: "common",
    name: "The DSA Manual",
    educator: "Striver + Love Babbar + Apna College",
    description: "One sheet with all questions from three sources, made for interview practice.",
    icon: "📚",
    questions: mergedQuestions,
  },
];