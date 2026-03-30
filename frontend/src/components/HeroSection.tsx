import { motion } from "framer-motion";
import { ArrowRight, Code2, Heart, GraduationCap, FolderOpen, BarChart3, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StarField } from "./StarField";
import { SpacePlanets } from "./SpacePlanets";
import { useTheme } from "@/hooks/useTheme";

const floatingCards = [
  {
    icon: Code2,
    name: "Striver DSA Sheet",
    creator: "Striver",
    questions: "191 Questions",
    rotate: "-8deg",
    translateY: "20px",
    zIndex: 1,
    delay: 0.4,
  },
  {
    icon: Heart,
    name: "Love Babbar DSA Sheet",
    creator: "Love Babbar",
    questions: "450 Questions",
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
    questions: "375 Questions",
    rotate: "8deg",
    translateY: "20px",
    zIndex: 1,
    delay: 0.6,
  },
];

const features = [
  {
    icon: FolderOpen,
    title: "Curated Problem Sets",
    description: "Solve questions from trusted DSA sheets created by top coding educators.",
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    description: "Mark questions solved and monitor your improvement.",
  },
  {
    icon: Layers,
    title: "Topic-Based Practice",
    description: "Practice problems organized by Arrays, Trees, Graphs, Dynamic Programming and more.",
  },
];

export function HeroSection() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-bg min-h-[90vh] flex items-center tech-grid-bg">
        <StarField count={150} />
        <div className="container relative pt-16 pb-8 md:pt-24 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <h1 className="mb-5 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1] text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              Master Data Structures
              <br />
              & Algorithms
              <br />
              <span className="text-foreground/70 text-3xl sm:text-4xl lg:text-5xl font-bold">
                with Curated Coding Sheets
              </span>
            </h1>

            <p className="mb-8 max-w-lg text-base text-foreground/60 leading-relaxed">
              Follow structured DSA sheets created by top educators
              and track your coding progress in one place.
            </p>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/signup")}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-xl"
              >
                Start Practicing
                <ArrowRight className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/signup")}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-card/80 backdrop-blur-sm px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-card"
              >
                Create Free Account
              </motion.button>
            </div>
          </motion.div>

          {/* Floating sheet preview cards — light mode only */}
          {!isDark && (
            <div className="relative mt-16 md:mt-20 flex justify-center items-end gap-4 md:gap-6 pb-8">
              {floatingCards.map((card) => (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, y: 60, rotate: 0 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotate: card.rotate,
                  }}
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

          {/* Space planets — dark mode only */}
          <SpacePlanets />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Practice smarter, not harder
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Instead of random problems, follow structured sheets designed for interviews.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="rounded-2xl border border-border bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <f.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-bg tech-grid-bg">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              Start Your DSA Journey Today
            </h2>
            <p className="text-foreground/60 max-w-md mx-auto mb-8">
              Create your account and begin solving curated coding problems.
            </p>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/signup")}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
