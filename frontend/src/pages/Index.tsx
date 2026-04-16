import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { useNavigate } from "react-router-dom";
import { SheetCard } from "@/components/SheetCard";
import { TopicProgressSection } from "@/components/TopicProgressSection";
import { StarField } from "@/components/StarField";
import { sheets } from "@/data/sheets";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/sheets", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}

export default Index;