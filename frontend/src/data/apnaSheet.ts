import apnaData from "./apna.json";
import { Question } from "./types";
import { convertQuestions } from "./utils";

export const apnaQuestions: Question[] = convertQuestions(apnaData, "ac");