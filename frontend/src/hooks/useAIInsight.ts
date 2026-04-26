import { useState, useCallback, useRef } from "react";

interface TopicData {
  topic: string;
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
  const [insights, setInsights] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const insightsRef = useRef<Record<string, string>>({});
  const loadingRef = useRef<Record<string, boolean>>({});

  const generateInsight = useCallback(async (data: TopicData) => {
    // Already generated or loading check
    if (insightsRef.current[data.topic] || loadingRef.current[data.topic]) return;

    loadingRef.current[data.topic] = true;
    setLoading(prev => ({ ...prev, [data.topic]: true }));


    try {
      const BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${BASE_URL}/ai-insight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      const insight = json.insight || "";

      insightsRef.current[data.topic] = insight;
      setInsights(prev => ({ ...prev, [data.topic]: insight }));
    } catch (err) {
      const fallback = "Keep solving more problems to get insights!";
      insightsRef.current[data.topic] = fallback;
      setInsights(prev => ({ ...prev, [data.topic]: fallback }));
    } finally {
      loadingRef.current[data.topic] = false;
      setLoading(prev => ({ ...prev, [data.topic]: false }));
    }
  }, []);

  return { insights, loading, generateInsight };
}