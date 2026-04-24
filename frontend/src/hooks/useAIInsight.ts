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

    const prompt = `You are a DSA coach. A student is practicing ${data.topic}.
Their progress:
- Easy: ${data.solvedEasy}/${data.totalEasy} solved
- Medium: ${data.solvedMedium}/${data.totalMedium} solved  
- Hard: ${data.solvedHard}/${data.totalHard} solved
- Patterns they have solved: ${data.solvedPatterns.join(", ") || "none"}
- Patterns not yet attempted: ${data.unsolvedPatterns.join(", ") || "none"}

Give exactly 1 short actionable line (max 12 words) telling what they should focus on next. Be specific about patterns or difficulty. No fluff.`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 50,
          temperature: 0.5,
        }),
      });
      

      const json = await response.json();
      const insight = json.choices?.[0]?.message?.content?.trim() || "";
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