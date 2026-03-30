import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { SheetCard } from "@/components/SheetCard";
import { TopicProgressSection } from "@/components/TopicProgressSection";
import { StarField } from "@/components/StarField";
import { sheets } from "@/data/sheets";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {!user ? (
          <HeroSection />
        ) : (
          <div className="relative gradient-bg tech-grid-bg min-h-[calc(100vh-4rem)]">
            <StarField count={80} />
            <section className="container relative z-10 py-16 md:py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10 text-center"
              >
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  Choose Your Sheet
                </h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Pick a curated DSA sheet and start tracking your progress question by question.
                </p>
              </motion.div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                {sheets.map((sheet, i) => (
                  <SheetCard key={sheet.id} sheet={sheet} index={i} />
                ))}
              </div>

              {/* Global topic progress */}
              <TopicProgressSection />
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
