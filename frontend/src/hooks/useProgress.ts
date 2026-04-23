import { useState, useCallback, useEffect } from "react";
import { getUserProgress, toggleProgress } from "@/lib/api";

function getSheetId(questionId: string): string {
  if (questionId.startsWith("striver")) return "striver";
  if (questionId.startsWith("babbar"))  return "babbar";
  if (questionId.startsWith("MER"))     return "merged";
  return "apna";
}

function getUserId(): string | null {
  try {
    const raw = localStorage.getItem("dsa-user");
    return raw ? JSON.parse(raw)?._id : null;
  } catch {
    return null;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadFromDB = async () => {
      const userId = getUserId();
      if (!userId) return;
      try {
        const solvedIds = await getUserProgress(userId);
        const map: Record<string, boolean> = {};
        solvedIds.forEach(id => { map[id] = true; });
        setProgress(map);
      } catch (err) {
        console.error("Progress load failed:", err);
      }
    };
    loadFromDB();
  }, []);

  const toggleSolved = useCallback(async (questionId: string) => {
    const userId = getUserId();
    if (!userId) return;
    const sheetId = getSheetId(questionId);
    try {
      const isSolvedNow = await toggleProgress({ userId, questionId, sheetId });
      setProgress(prev => ({ ...prev, [questionId]: isSolvedNow }));
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  }, []);

  const isSolved = useCallback((questionId: string) => {
    return !!progress[questionId];
  }, [progress]);

  const getSolvedCount = useCallback((questionIds: string[]) => {
    return questionIds.filter(id => !!progress[id]).length;
  }, [progress]);

  return { toggleSolved, isSolved, getSolvedCount };
}