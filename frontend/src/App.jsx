import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SummaryView from "./components/SummaryView";
import ChatOrVoice from "./components/ChatOrVoice";

const API_BASE = "/api";

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");

  const handleSummarize = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }
    setError("");
    setLoading(true);
    setData(null);
    try {
      const res = await fetch(`${API_BASE}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const text = await res.text();
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(res.ok ? "Invalid response from server" : text || "Request failed");
      }
      if (!res.ok) throw new Error(json.detail || json.message || text || "Failed to summarize");
      setData(json);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            YouTube Video Summary
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="url"
            placeholder="Paste YouTube URL (e.g. https://youtube.com/watch?v=...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSummarize()}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            onClick={handleSummarize}
            disabled={loading}
            className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? "Analyzing…" : "Summarize"}
          </button>
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}

        {/* Results */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10"
            >
              {/* Tabs */}
              <div className="mb-6 flex gap-2 border-b border-slate-800">
                {["summary", "chat"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium capitalize transition ${
                      activeTab === tab
                        ? "border-b-2 border-brand-500 text-brand-400"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "summary" && <SummaryView data={data} />}
              {activeTab === "chat" && (
                <ChatOrVoice context={data.full_transcript || data.summary?.overview} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
