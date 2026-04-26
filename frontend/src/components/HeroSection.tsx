import { motion } from "framer-motion";
import { ArrowRight, Code2, Heart, GraduationCap, FolderOpen, BarChart3, Layers, BookOpen, CheckCircle2, Trophy, Bot, Link2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StarField } from "./StarField";
import { SpacePlanets } from "./SpacePlanets";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext"; // ✅ ADD

const floatingCards = [
  {
    icon: Code2,
    name: "Striver DSA Sheet",
    creator: "Striver",
    questions: "454 Questions",
    rotate: "-8deg",
    translateY: "20px",
    zIndex: 1,
    delay: 0.4,
  },
  {
    icon: Heart,
    name: "Love Babbar DSA Sheet",
    creator: "Love Babbar",
    questions: "444 Questions",
    rotate: "0deg",
    translateY: "0px",
    zIndex: 10,
    delay: 0.5,
    featured: true,
  },
  {
    icon: GraduationCap,
    name: "Apna College DSA Sheet",
    creator: "Apna College",
    questions: "193 Questions",
    rotate: "8deg",
    translateY: "20px",
    zIndex: 1,
    delay: 0.6,
  },
];

export function HeroSection() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth(); // ✅ ADD

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-bg min-h-[90vh] flex items-center tech-grid-bg">
        <StarField count={200} />
        <div className="container relative pt-16 pb-8 md:pt-24 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <h1 className="mb-5 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1] text-foreground">
              Start Your DSA Journey
              <br />
              <span className="text-foreground/70 text-3xl sm:text-4xl lg:text-5xl font-bold">
                All Questions in One Place
              </span>
            </h1>

            <p className="mb-8 max-w-lg text-base text-foreground/60 leading-relaxed">
              Practice DSA with structured sheets from top educators and improve step by step.
            </p>

            <div className="flex items-center gap-3">
              {/* ✅ FIXED: user logged in hai toh /sheets, warna /signup */}
              {!user && (
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/signup")}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-xl"
                >
                  Start Practicing
                </motion.button>
              )}
              {user && (
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/sheets")}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-xl"
                >
                  Go to Sheets
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Floating sheet preview cards — light mode only */}
          {!isDark && (
            <div className="relative mt-16 md:mt-20 flex justify-center items-end gap-4 md:gap-6 pb-8">
              {floatingCards.map((card) => (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, y: 60, rotate: 0 }}
                  animate={{ opacity: 1, y: 0, rotate: card.rotate }}
                  transition={{ delay: card.delay, duration: 0.6, ease: "easeOut" }}
                  whileHover={{ y: -12, rotate: "0deg", scale: 1.05 }}
                  className={`relative w-52 md:w-64 rounded-2xl bg-card p-6 cursor-default transition-shadow border border-border ${card.featured ? "z-10 md:w-72 shadow-xl" : "shadow-lg"}`}
                  style={{ transform: `translateY(${card.translateY})`, zIndex: card.zIndex }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                    <card.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-base font-bold text-card-foreground leading-snug mb-1" style={{ fontFamily: "var(--font-display)" }}>
                    {card.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                    {card.creator}
                  </p>
                  <span className="inline-block text-[11px] bg-secondary text-muted-foreground rounded-full px-3 py-1 font-medium" style={{ fontFamily: "var(--font-mono)" }}>
                    {card.questions}
                  </span>
                </motion.div>
              ))}
            </div>
          )}

          <SpacePlanets />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              How it works
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Three simple steps to go from zero to interview-ready.
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

            <div className="grid gap-10 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Choose Your Sheet",
                  description: "Pick from Striver, Love Babbar, or Apna College — or use The DSA Manual with all problems in one place.",
                  icon: BookOpen,
                },
                {
                  step: "02",
                  title: "Solve & Track",
                  description: "Tick problems as you solve them. Your progress saves automatically — even after logout.",
                  icon: CheckCircle2,
                },
                {
                  step: "03",
                  title: "Get AI Help",
                  description: "Chat with AlgoShee — your personal DSA buddy who knows your progress and guides you.",
                  icon: Trophy,
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.18, duration: 0.5 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl glass-card">
                      <item.icon className="h-7 w-7 text-accent" />
                    </div>
                    <span
                      className="absolute -top-2 -right-3 text-xs font-bold"
                      style={{ color: "hsl(243 75% 55%)", fontFamily: "var(--font-mono)" }}
                    >
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 gradient-bg tech-grid-bg">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              Everything you need
            </h2>
            <p className="text-foreground/60 max-w-md mx-auto">
              Built for serious DSA prep — not just another problem list.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Curated Sheets",
                description: "TUF AtoZ, Love Babbar, Apna College, and The DSA Manual — all in one place, all for free.",
              },
              {
                title: "AI Assistant — AlgoShee",
                description: "Ask AlgoShee about any DSA problem. Get similar LeetCode problems with direct links and approaches.",
              },
              {
                title: "Topic-wise Insights",
                description: "See your confidence level per topic — from Struggling to Expert. Get AI tips on what to focus next.",
              },
              {
                title: "Smart Cross-Sheet Sync",
                description: "Solve a problem in one sheet — it auto-ticks in other sheets where the same topic appears.",
              },
              {
                title: "Persistent Progress",
                description: "Login once and your progress is saved forever. Switch devices anytime — your data stays.",
              },
              {
                title: "Progress Tracking",
                description: "Track Easy, Medium, Hard problems across all 4 sheets. Watch your progress bar grow in real time.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="text-base font-bold mb-2 text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}