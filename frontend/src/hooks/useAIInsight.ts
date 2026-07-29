import { useState, useCallback, useRef } from "react";

const CACHE_KEY = "dsa-ai-insights";

function loadCachedInsights(): Record<string, { insight: string; solvedCount: number }> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveCachedInsights(cache: Record<string, { insight: string; solvedCount: number }>) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

interface TopicData {
  topic: string;
  solvedCount: number;
  solvedEasy: number;
  totalEasy: number;
  solvedMedium: number;
  totalMedium: number;
  solvedHard: number;
  totalHard: number;
  solvedPatterns: string[];
  unsolvedPatterns: string[];
}

export function useAIInsight() {
  const [insights, setInsights] = useState<Record<string, string>>(() => {
    const cache = loadCachedInsights();
    const result: Record<string, string> = {};
    Object.entries(cache).forEach(([topic, val]) => {
      result[topic] = val.insight;
    });
    return result;
  });

  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const loadingRef = useRef<Record<string, boolean>>({});

  const generateInsight = useCallback(async (data: TopicData) => {
    const cache = loadCachedInsights();
    const cached = cache[data.topic];

    if (cached && cached.solvedCount === data.solvedCount) return;

    if (loadingRef.current[data.topic]) return;

    loadingRef.current[data.topic] = true;
    setLoading(prev => ({ ...prev, [data.topic]: true }));


    try {
      const BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${BASE_URL}/ai-insight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("dsa-token") || ""}`,
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      const insight = json.insight || "";

      cache[data.topic] = { insight, solvedCount: data.solvedCount };
      saveCachedInsights(cache);

      setInsights(prev => ({ ...prev, [data.topic]: insight }));
    } catch {
      const fallback = "Keep solving more problems to get insights!";
      setInsights(prev => ({ ...prev, [data.topic]: fallback }));
    } finally {
      loadingRef.current[data.topic] = false;
      setLoading(prev => ({ ...prev, [data.topic]: false }));
    }
  }, []);

  return { insights, loading, generateInsight };
}