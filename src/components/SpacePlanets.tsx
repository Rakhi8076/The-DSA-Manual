import { useMemo } from "react";

const planets = [
  {
    name: "Striver DSA Sheet",
    creator: "Striver",
    questions: "191 Questions",
    gradient: "from-purple-500 to-blue-500",
    glow: "shadow-purple-500/30",
    orbitRadius: 180,
    duration: 28,
    startAngle: 0,
    size: 52,
  },
  {
    name: "Love Babbar DSA Sheet",
    creator: "Love Babbar",
    questions: "450 Questions",
    gradient: "from-pink-500 to-orange-400",
    glow: "shadow-pink-500/30",
    orbitRadius: 240,
    duration: 32,
    startAngle: 120,
    size: 58,
  },
  {
    name: "Apna College DSA Sheet",
    creator: "Apna College",
    questions: "375 Questions",
    gradient: "from-teal-400 to-cyan-400",
    glow: "shadow-teal-400/30",
    orbitRadius: 300,
    duration: 35,
    startAngle: 240,
    size: 48,
  },
];

export function SpacePlanets() {
  return (
    <div className="hidden dark:flex relative justify-center items-center w-full" style={{ height: 680 }}>
      {/* Orbit rings */}
      {planets.map((p, i) => (
        <div
          key={`orbit-${i}`}
          className="absolute rounded-full border border-dashed border-white/15"
          style={{
            width: p.orbitRadius * 2,
            height: p.orbitRadius * 2,
          }}
        />
      ))}

      {/* Center star */}
      <div className="absolute z-10 flex flex-col items-center justify-center rounded-full animate-pulse-slow"
        style={{
          width: 130,
          height: 130,
          background: "radial-gradient(circle, rgba(253,224,71,0.35) 0%, rgba(253,224,71,0.08) 60%, transparent 100%)",
          boxShadow: "0 0 60px 20px rgba(253,224,71,0.15), 0 0 120px 40px rgba(253,224,71,0.06)",
        }}
      >
        <div className="rounded-full flex flex-col items-center justify-center text-center"
          style={{
            width: 100,
            height: 100,
            background: "radial-gradient(circle, rgba(253,224,71,0.5) 0%, rgba(250,204,21,0.2) 100%)",
            boxShadow: "0 0 30px 10px rgba(253,224,71,0.2)",
          }}
        >
          <span className="text-[10px] font-bold text-yellow-200 leading-tight">DSA Sheets Hub</span>
          <span className="text-[8px] text-yellow-300/70 mt-0.5">Explore the Coding Galaxy</span>
        </div>
      </div>

      {/* Revolving planets */}
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
          {/* Planet positioned at top of orbit circle */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: 0, transform: "translateX(-50%) translateY(-50%)" }}
          >
            {/* Counter-rotate to keep label upright */}
            <div
              style={{
                animation: `counter-orbit ${planet.duration}s linear infinite`,
                animationDelay: `${-(planet.startAngle / 360) * planet.duration}s`,
              }}
              className="flex flex-col items-center"
            >
              {/* Planet sphere */}
              <div
                className={`rounded-full bg-gradient-to-br ${planet.gradient} shadow-lg ${planet.glow} animate-float`}
                style={{
                  width: planet.size,
                  height: planet.size,
                  animationDelay: `${i * 1.2}s`,
                }}
              />
              {/* Label */}
              <div className="mt-2 text-center whitespace-nowrap bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
                <p className="text-[11px] font-semibold text-white/90">{planet.name}</p>
                <p className="text-[9px] text-white/50">by {planet.creator}</p>
                <p className="text-[9px] text-white/40">{planet.questions}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
