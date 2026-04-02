import lovebabbarData from "./lovebabbar.json";
import { Question } from "./types";
import { convertQuestions } from "./utils";

export const lovebabbarQuestions: Question[] = convertQuestions(lovebabbarData, "lb");