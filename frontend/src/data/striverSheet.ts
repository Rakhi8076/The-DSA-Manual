import striverData from "./striver.json";
import { Question } from "./types";
import { convertQuestions } from "./utils";

export const striverQuestions: Question[] = convertQuestions(striverData, "striver");