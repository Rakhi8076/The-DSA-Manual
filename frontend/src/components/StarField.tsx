import { useMemo } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  color: string;
}

const STAR_COLORS = [
  "255,255,255",
  "255,255,255",
  "255,255,255",
  "180,160,255",
  "160,220,255",
  "255,220,180",
];

export function StarField({ count = 120 }: { count?: number }) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.45 + 0.35,
      delay: Math.random() * 6,
      duration: Math.random() * 3 + 3,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    }));
  }, [count]);

  const brightStars = useMemo(() => {
    return Array.from({ length: 8 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 2.5,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 4,
    }));
  }, []);

  return (
    <div className="hidden dark:block pointer-events-none absolute inset-0 overflow-hidden z-0">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            background: `rgb(${star.color})`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {brightStars.map((star, i) => (
        <div
          key={`bright-${i}`}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: 0.85,
            background: "white",
            boxShadow: `0 0 ${star.size * 3}px ${star.size}px rgba(200,200,255,0.4)`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}