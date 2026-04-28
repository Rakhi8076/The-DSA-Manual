import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { sendChatMessage } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { sheets } from "@/data/sheets";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function renderMessageContent(content: string) {
  const parts = content.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith("http://") || part.startsWith("https://")) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer"
          className="underline text-blue-300 hover:text-blue-200 break-all">
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ✅ Sheet + Topic wise detailed context
function buildProgressContext(getSolvedCount: (ids: string[]) => number): string {
  return sheets.map(sheet => {  // ✅ common bhi include
    const total = sheet.questions.length;
    const solved = getSolvedCount(sheet.questions.map(q => q.id));
    const pending = total - solved;

    const topics = [...new Set(sheet.questions.map(q => q.topic))];
    const topicBreakdown = topics.map(topic => {
      const topicQs = sheet.questions.filter(q => q.topic === topic);
      const topicSolved = getSolvedCount(topicQs.map(q => q.id));
      const topicPending = topicQs.length - topicSolved;
      return `  - ${topic}: ${topicSolved}/${topicQs.length} solved, ${topicPending} pending`;
    }).join("\n");

    return `${sheet.name} (${sheet.id}): ${solved}/${total} solved, ${pending} pending\nTopics:\n${topicBreakdown}`;
  }).join("\n\n");
}

// ✅ User specific chat key
function getChatKey(userId: string): string {
  return `algoshee-chat-${userId}`;
}

// ✅ localStorage se load
function loadMessages(userId: string): Message[] {
  try {
    const raw = localStorage.getItem(getChatKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ✅ localStorage mein save
function saveMessages(userId: string, messages: Message[]) {
  localStorage.setItem(getChatKey(userId), JSON.stringify(messages));
}

export function Chatbot() {
  const { user } = useAuth();
  const { getSolvedCount } = useProgress();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // ✅ User login hone pe history load karo
  useEffect(() => {
    if (user?._id) {
      const saved = loadMessages(user._id);
      setMessages(saved);
    }
  }, [user?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user) return null;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    saveMessages(user._id, newMessages); // ✅ save
    setLoading(true);

    try {
      const historyToSend = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const progressContext = buildProgressContext(getSolvedCount);
      const messageWithContext = `${userMessage}\n\n[User Progress Context]\n${progressContext}`;

      const reply = await sendChatMessage(messageWithContext, historyToSend);

      setMessages(prev => {
        const updated = [...prev, { role: "assistant" as const, content: reply }];
        saveMessages(user._id, updated); // ✅ save
        return updated;
      });
    } catch {
      setMessages(prev => {
        const updated = [...prev, { role: "assistant" as const, content: "Something went wrong. Please try again." }];
        saveMessages(user._id, updated);
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={chatRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{ width: "360px", height: "480px", background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ background: "hsl(243 80% 60%)" }}>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white">AlgoShee</span>
            </div>
            <div className="flex items-center gap-2">
              {/* ✅ Chat clear button */}
              <button
                onClick={() => {
                  setMessages([]);
                  saveMessages(user._id, []);
                }}
                className="text-[10px] text-white/60 hover:text-white/90 transition"
              >
                Clear
              </button>
              {/* <button onClick={() => setOpen(false)}>
                <X className="h-4 w-4 text-white hover:opacity-70" />
              </button> */}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-xs text-gray-400 text-center mt-10">
                Hey! 👋 I'm AlgoShee, your DSA buddy. Ask me anything!
              </p>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap"
                  style={{
                    background: msg.role === "user" ? "hsl(243 80% 60%)" : "rgba(255,255,255,0.08)",
                    color: "white",
                  }}
                >
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-xs"
                  style={{ background: "rgba(255,255,255,0.08)", color: "white" }}>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask about any DSA problem..."
              className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-xs text-white placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-white/30"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-110 disabled:opacity-50"
              style={{ background: "hsl(243 80% 60%)" }}
            >
              <Send className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110"
        style={{ background: "hsl(243 80% 60%)" }}
      >
        {open ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
      </button>
    </div>
  );
}