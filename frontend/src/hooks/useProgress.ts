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

  const linkedIds: string[] = [];
  for (const sheet of sheets) {
    for (const q of sheet.questions) {
      if (
        q.leetcode?.trim().toLowerCase() === targetUrl &&
        (q.topic || "").trim().toLowerCase() === targetTopic
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
    const linkedIds = getLinkedQuestionIds(questionId);
    const newState = !progress[questionId];

    // ✅ PEHLE UI update karo — DB ka wait mat karo
    setProgress(prev => {
      const next = { ...prev };
      linkedIds.forEach(id => { next[id] = newState; });
      return next;
    });

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
      } catch (err) {
        // ✅ Error pe rollback karo
        console.error("Toggle failed — rolling back:", err);
        setProgress(prev => {
          const next = { ...prev };
          linkedIds.forEach(id => { next[id] = !newState; });
          return next;
        });
      }
    } else {
      // Guest — localStorage mein save karo
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