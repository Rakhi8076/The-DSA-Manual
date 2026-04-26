import { useState, useCallback, useEffect } from "react";
import { getUserProgress, setProgress as setProgressAPI } from "@/lib/api";
import { sheets } from "@/data/sheets";

const LOCAL_KEY = "dsa-guest-progress";

function getSheetId(questionId: string): string {
  if (questionId.startsWith("striver")) return "striver";
  if (questionId.startsWith("lb_"))     return "lovebabbar";
  if (questionId.startsWith("MER"))     return "common";
  if (questionId.startsWith("ac_"))     return "apnacollege";
  return "apnacollege";
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
  // ✅ Pehle is question ka URL aur topic dhundo
  let targetUrl = "";
  let targetTopic = "";

  for (const sheet of sheets) {
    const found = sheet.questions.find(q => q.id === questionId);
    if (found?.leetcode) {
      targetUrl = found.leetcode.trim().toLowerCase();
      targetTopic = (found.topic || "").trim().toLowerCase();
      break;
    }
  }

  if (!targetUrl) return [questionId];

  // ✅ Same URL + Same topic dono match hone chahiye
  const linkedIds: string[] = [];
  for (const sheet of sheets) {
    for (const q of sheet.questions) {
      if (
        q.leetcode?.trim().toLowerCase() === targetUrl &&
        (q.topic || "").trim().toLowerCase() === targetTopic  // ✅ topic bhi same
      ) {
        linkedIds.push(q.id);
      }
    }
  }

  return linkedIds.length > 0 ? linkedIds : [questionId];
}

function loadLocalProgress(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveLocalProgress(progress: Record<string, boolean>) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(progress));
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      getUserProgress(userId)
        .then(solvedIds => {
          const map: Record<string, boolean> = {};
          solvedIds.forEach(id => { map[id] = true; });
          setProgress(map);
        })
        .catch(err => console.error("Progress load failed:", err));
    } else {
      setProgress(loadLocalProgress());
    }
  }, []);

  const toggleSolved = useCallback(async (questionId: string) => {
    const userId = getUserId();
    const linkedIds = getLinkedQuestionIds(questionId); // ✅ URL + topic match
    const newState = !progress[questionId];

    if (userId) {
      try {
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
        setProgress(prev => {
          const next = { ...prev };
          linkedIds.forEach(id => { next[id] = newState; });
          return next;
        });
      } catch (err) {
        console.error("Toggle failed:", err);
      }
    } else {
      setProgress(prev => {
        const next = { ...prev };
        linkedIds.forEach(id => { next[id] = newState; });
        saveLocalProgress(next);
        return next;
      });
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