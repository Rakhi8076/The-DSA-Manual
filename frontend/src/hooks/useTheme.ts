import { useCallback } from "react";

export function useTheme() {
  const isDark = true;
  const toggle = useCallback(() => {}, []);
  return { isDark, toggle };
}