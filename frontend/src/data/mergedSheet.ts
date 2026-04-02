import mergedData from "./merged.json";
import { Question } from "./types";
import { convertQuestions } from "./utils";

export const mergedQuestions: Question[] = convertQuestions(mergedData, "merged");