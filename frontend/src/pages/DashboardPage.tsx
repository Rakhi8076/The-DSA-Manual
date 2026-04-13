import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import merged from "@/data/merged.json";
import { useEffect, useState } from "react";
import { getDailyDigest } from "@/lib/api";

// ✅ Type for digest response
interface DigestData {
  problemsSolved: number;
  timeSpent: number;
  streak: number;
  topics: string[];
  digest: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [digestData, setDigestData] = useState<DigestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const total = merged.length;
  const easyCount = merged.filter((q) => q.difficulty === "Easy").length;
  const mediumCount = merged.filter((q) => q.difficulty === "Medium").length;
  const hardCount = merged.filter((q) => q.difficulty === "Hard").length;
  const solved = total;
  const circumference = 2 * Math.PI * 60;

  useEffect(() => {
    const fetchDigest = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const res = await getDailyDigest(user._id);

        // ✅ Backend returns flat response — map directly, no res.stats nesting
        setDigestData({
          problemsSolved: res.problemsSolved ?? 0,
          timeSpent:      res.timeSpent ?? 0,
          streak:         res.streak ?? 0,
          topics:         res.topics ?? [],
          digest:         res.digest ?? "Aaj ka digest load nahi hua.",
        });
      } catch (err: any) {
        console.error("Digest fetch error:", err);
        setError("Digest load nahi hua. Thodi der baad try karo.");
      } finally {
        setLoading(false);
      }
    };

    fetchDigest();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      <Header />

      <div className="flex-1 flex justify-center p-6">
        <div className="w-full max-w-5xl">

          <button
            onClick={() => navigate("/")}
            className="mb-4 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition text-sm"
          >
            ← Back to Home
          </button>

          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

            {/* Profile */}
            <div className="bg-white/10 p-5 rounded-2xl">
              <h2 className="text-lg font-semibold mb-4">Profile</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Name</span>
                  <span className="text-sm font-medium">
                    {user?.name || "Guest"}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-gray-400 text-sm shrink-0">Email</span>
                  <span className="text-sm font-medium truncate">
                    {user?.email || "Not available"}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white/10 p-5 rounded-2xl">
              <h2 className="text-lg font-semibold mb-4">Stats</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Solved</span>
                  <span className="font-semibold">{solved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">Easy</span>
                  <span>{easyCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-400">Medium</span>
                  <span>{mediumCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-400">Hard</span>
                  <span>{hardCount}</span>
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-white/10 p-5 rounded-2xl">
              <h2 className="text-lg font-semibold mb-4">Streak</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current</span>
                  {/* ✅ From real digest data */}
                  <span className="font-semibold">
                    {digestData?.streak ?? 0} days 🔥
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Today's Problems</span>
                  <span>{digestData?.problemsSolved ?? 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Digest */}
          <div className="mb-6 rounded-2xl p-6 bg-white/10 shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Daily Digest</h2>

            {loading ? (
              <p className="text-sm text-gray-400">Loading digest...</p>
            ) : error ? (
              <p className="text-sm text-red-400">{error}</p>
            ) : (
              <>
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                  {digestData?.digest}
                </p>

                {/* ✅ Stats row */}
                <div className="flex flex-wrap gap-6 text-sm text-gray-300 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                    <span>{digestData?.problemsSolved} problems</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">⏱</span>
                    <span>{digestData?.timeSpent} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🔥</span>
                    <span>{digestData?.streak} streak</span>
                  </div>
                </div>

                {/* ✅ Topics */}
                {digestData?.topics && digestData.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {digestData.topics.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 bg-indigo-500/20 text-indigo-300
                                   text-xs rounded-full border border-indigo-500/30"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Progress */}
          <div className="bg-white/10 p-8 rounded-2xl shadow-lg shadow-black/30">
            <h2 className="text-lg font-semibold mb-6 text-center">Progress</h2>
            <div className="flex items-center justify-center gap-12">
              <div className="relative w-40 h-40 shrink-0">
                <svg
                  className="w-full h-full rotate-[-90deg]"
                  viewBox="0 0 144 144"
                >
                  <circle
                    cx="72" cy="72" r="60"
                    stroke="white" strokeWidth="8"
                    fill="transparent" opacity="0.1"
                  />
                  <circle
                    cx="72" cy="72" r="60"
                    stroke="cyan" strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference - (circumference * solved) / total
                    }
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold leading-none">
                    {solved}
                    <span className="text-xs text-gray-400 font-normal">
                      /{total}
                    </span>
                  </p>
                  <p className="text-green-400 text-xs mt-1">Solved</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[120px]">
                <div className="bg-white/10 px-5 py-3 rounded-xl text-center">
                  <p className="text-green-400 text-xs font-medium mb-1">Easy</p>
                  <p className="text-lg font-bold">{easyCount}</p>
                </div>
                <div className="bg-white/10 px-5 py-3 rounded-xl text-center">
                  <p className="text-yellow-400 text-xs font-medium mb-1">Medium</p>
                  <p className="text-lg font-bold">{mediumCount}</p>
                </div>
                <div className="bg-white/10 px-5 py-3 rounded-xl text-center">
                  <p className="text-red-400 text-xs font-medium mb-1">Hard</p>
                  <p className="text-lg font-bold">{hardCount}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}