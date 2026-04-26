import { useMemo } from "react";

const planets = [
  {
    name: "Striver DSA Sheet",
    creator: "Striver",
    gradient: "from-violet-400 via-purple-500 to-blue-500",
    glow: "rgba(139, 92, 246, 0.6)",
    orbitRadius: 180,
    duration: 28,
    startAngle: 0,
    size: 52,
  },
  {
    name: "Love Babbar DSA Sheet",
    creator: "Love Babbar",
    gradient: "from-rose-400 via-pink-500 to-orange-400",
    glow: "rgba(244, 63, 94, 0.6)",
    orbitRadius: 240,
    duration: 32,
    startAngle: 120,
    size: 58,
  },
  {
    name: "Apna College DSA Sheet",
    creator: "Apna College",
    gradient: "from-teal-300 via-cyan-400 to-emerald-400",
    glow: "rgba(34, 211, 238, 0.6)",
    orbitRadius: 300,
    duration: 35,
    startAngle: 240,
    size: 48,
  },
];

export function SpacePlanets() {
  return (
    <div
      className="hidden dark:flex relative justify-center items-center w-full"
      style={{ height: 680 }}
    >
      {/* ── Nebula background layers ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 55% 45% at 50% 50%, hsl(258 80% 18% / 0.55) 0%, transparent 65%),
            radial-gradient(ellipse 30% 30% at 30% 40%, hsl(280 70% 15% / 0.35) 0%, transparent 55%),
            radial-gradient(ellipse 25% 25% at 72% 62%, hsl(195 80% 12% / 0.3) 0%, transparent 55%)
          `,
          filter: "blur(32px)",
        }}
      />

      {/* ── Orbit rings ── */}
      {planets.map((p, i) => (
        <div
          key={`orbit-${i}`}
          className="absolute rounded-full"
          style={{
            width: p.orbitRadius * 2,
            height: p.orbitRadius * 2,
            border: "1px dashed",
            borderColor:
              i === 0
                ? "rgba(139,92,246,0.35)"
                : i === 1
                  ? "rgba(244,63,94,0.3)"
                  : "rgba(34,211,238,0.28)",
            boxShadow:
              i === 0
                ? "0 0 18px 1px rgba(139,92,246,0.08) inset"
                : i === 1
                  ? "0 0 18px 1px rgba(244,63,94,0.07) inset"
                  : "0 0 18px 1px rgba(34,211,238,0.07) inset",
          }}
        />
      ))}

      {/* ── Center star ── */}
      <div
        className="absolute z-10 flex flex-col items-center justify-center rounded-full animate-pulse-slow"
        style={{
          width: 140,
          height: 140,
          background:
            "radial-gradient(circle, rgba(253,224,71,0.5) 0%, rgba(253,224,71,0.15) 50%, transparent 100%)",
          boxShadow:
            "0 0 70px 28px rgba(253,224,71,0.22), 0 0 130px 50px rgba(253,224,71,0.09), 0 0 200px 80px rgba(253,180,20,0.06)",
        }}
      >
        <div
          className="rounded-full flex flex-col items-center justify-center text-center"
          style={{
            width: 104,
            height: 104,
            background:
              "radial-gradient(circle, rgba(253,224,71,0.65) 0%, rgba(250,204,21,0.3) 60%, rgba(250,180,10,0.1) 100%)",
            boxShadow:
              "0 0 35px 12px rgba(253,224,71,0.3), inset 0 0 20px rgba(255,255,200,0.15)",
            border: "1px solid rgba(253,224,71,0.3)",
          }}
        >
          <span className="text-[10px] font-bold text-white leading-tight drop-shadow">
            The DSA Manual
          </span>
          <span className="text-[8px] text-white/80 mt-0.5">
            Explore the Coding Galaxy
          </span>
        </div>
      </div>

      {/* ── Revolving planets ── */}
      {planets.map((planet, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: planet.orbitRadius * 2,
            height: planet.orbitRadius * 2,
            animation: `orbit ${planet.duration}s linear infinite`,
            animationDelay: `${-(planet.startAngle / 360) * planet.duration}s`,
          }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: 0, transform: "translateX(-50%) translateY(-50%)" }}
          >
            <div
              style={{
                animation: `counter-orbit ${planet.duration}s linear infinite`,
                animationDelay: `${-(planet.startAngle / 360) * planet.duration}s`,
              }}
              className="flex flex-col items-center"
            >
              {/* Planet sphere */}
              <div
                className={`rounded-full bg-gradient-to-br ${planet.gradient} animate-float`}
                style={{
                  width: planet.size,
                  height: planet.size,
                  animationDelay: `${i * 1.2}s`,
                  boxShadow: `0 0 22px 6px ${planet.glow}, 0 0 45px 12px ${planet.glow.replace("0.6", "0.2")}`,
                  border: "1.5px solid rgba(255,255,255,0.25)",
                }}
              />

              {/* Label card */}
              <div
                className="mt-2 text-center whitespace-nowrap rounded-xl px-3 py-2"
                style={{
                  background: "rgba(10, 8, 28, 0.82)",
                  backdropFilter: "blur(14px)",
                  border: `1px solid ${planet.glow.replace("0.6", "0.35")}`,
                  boxShadow: `0 4px 20px ${planet.glow.replace("0.6", "0.2")}`,
                }}
              >
                <p className="text-[11px] font-semibold text-white leading-tight">
                  {planet.name}
                </p>
                <p className="text-[9px] mt-0.5" style={{ color: planet.glow.replace("0.6)", "0.9)").replace("rgba", "rgba") }}>
                  by {planet.creator}
                </p>
                
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}