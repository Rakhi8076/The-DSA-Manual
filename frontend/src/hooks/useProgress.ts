import { useState, useCallback } from "react";

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

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, boolean>>(loadProgress);

  const toggleSolved = useCallback((questionId: string) => {
    setProgress(prev => {
      const next = { ...prev, [questionId]: !prev[questionId] };
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
