export interface Question {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  leetcode: string;
  gfg: string;
  link: string;
  topic: string;
  section: string;
  pattern: string;
}

export interface Sheet {
  id: string;
  name: string;
  educator: string;
  description: string;
  icon: string;
  questions: Question[];
}