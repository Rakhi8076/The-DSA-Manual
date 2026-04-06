import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SheetCard } from "@/components/SheetCard";
import { sheets } from "@/data/sheets";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { TopicProgressSection } from "@/components/TopicProgressSection";

export default function SheetsPage() {
    const { user } = useAuth();
    const isLoggedIn = !!user;

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container py-1">
                <section id="sheets" className="scroll-mt-20">
                    <div className="container py-16">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                                Choose Your DSA Sheet
                            </h2>
                            <p className="text-muted-foreground text-sm max-w-md mx-auto">
                                Browse popular DSA sheets. Login to track your progress.
                            </p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {sheets.map((sheet, i) => (
                                <SheetCard key={sheet.id} sheet={sheet} index={i} isLoggedIn={isLoggedIn} />
                            ))}
                        </div>
                        {!isLoggedIn && (
                            <div className="mt-10 text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold text-sm shadow-lg shadow-accent/25 transition-all"
                                >
                                    🔓 Login to unlock tracking
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
                {isLoggedIn && <TopicProgressSection />}
            </main>

            <Footer />
        </div>
    );
}