import { useState, useCallback } from "react";
import { sheets } from "@/data/sheets";

const STORAGE_KEY = "dsa-sheets-progress";

function loadProgress(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getLinkedQuestionIds(questionId: string): string[] {
  // Find the URL for the given question ID
  let targetUrl = "";
  for (const sheet of sheets) {
    const found = sheet.questions.find(q => q.id === questionId);
    if (found) {
      targetUrl = found.leetcode?.trim().toLowerCase();
      break;
    }
  }

  if (!targetUrl) return [questionId];

  // Find same URL questions in all sheets
  const linkedIds: string[] = [];
  for (const sheet of sheets) {
    for (const q of sheet.questions) {
      if (q.leetcode?.trim().toLowerCase() === targetUrl) {
        linkedIds.push(q.id);
      }
    }
  }

  return linkedIds.length > 0 ? linkedIds : [questionId];
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, boolean>>(loadProgress);

   const toggleSolved = useCallback((questionId: string) => {
    setProgress(prev => {
      const newState = !prev[questionId];

      // all ques ids with same URL (including itself)
      const linkedIds = getLinkedQuestionIds(questionId);

      // Mark all as solved/unsolved
      const next = { ...prev };
      linkedIds.forEach(id => {
        next[id] = newState;
      });

      saveProgress(next);
      return next;
    });
  }, []);

  const isSolved = useCallback((questionId: string) => {
    return !!progress[questionId];
  }, [progress]);

  const getSolvedCount = useCallback((questionIds: string[]) => {
    return questionIds.filter(id => !!progress[id]).length;
  }, [progress]);

  return { toggleSolved, isSolved, getSolvedCount };
}
