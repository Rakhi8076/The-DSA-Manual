import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SheetCard } from "@/components/SheetCard";
import { StarField } from "@/components/StarField";
import { sheets } from "@/data/sheets";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";


const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("sessionExpired") === "true") {
      toast({
        title: "Session expired",
        description: "Please login again to continue.",
        variant: "destructive",
      });
      setSearchParams({});
    }
  }, [searchParams]);



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

