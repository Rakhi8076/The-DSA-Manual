import { useState, useCallback, useEffect } from "react";
import { getUserProgress, setProgress as setProgressAPI } from "@/lib/api";
import { sheets } from "@/data/sheets";

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

function getLinkedQuestionIds(questionId: string): string[] {
  let targetUrl = "";
  for (const sheet of sheets) {
    const found = sheet.questions.find(q => q.id === questionId);
    if (found?.leetcode) {
      targetUrl = found.leetcode.trim().toLowerCase();
      break;
    }
  }

  if (!targetUrl) return [questionId];

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

    const linkedIds = getLinkedQuestionIds(questionId);
    const newState = !progress[questionId];

    try {
      // ✅ Saare linked questions directly set karo — toggle nahi
      await Promise.all(
        linkedIds.map(id =>
          setProgressAPI({
            userId,
            questionId: id,
            sheetId: getSheetId(id),
            solved: newState,
          })
        )
      );

      // ✅ UI ek saath update
      setProgress(prev => {
        const next = { ...prev };
        linkedIds.forEach(id => { next[id] = newState; });
        return next;
      });

    } catch (err) {
      console.error("Toggle failed:", err);
    }
  }, [progress]);

  const isSolved = useCallback((questionId: string) => {
    return !!progress[questionId];
  }, [progress]);

  const getSolvedCount = useCallback((questionIds: string[]) => {
    return questionIds.filter(id => !!progress[id]).length;
  }, [progress]);

  return { toggleSolved, isSolved, getSolvedCount };
}