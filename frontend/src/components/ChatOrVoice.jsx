import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const API_BASE = "/api";

export default function ChatOrVoice({ context }) {
  const [inputMode, setInputMode] = useState("text"); // "text" | "voice"
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addToMessages = (userContent, assistantContent) => {
    setMessages((m) => [
      ...m,
      { role: "user", content: userContent },
      { role: "assistant", content: assistantContent },
    ]);
  };

  const sendText = async () => {
    if (!message.trim() || !context) return;
    const userMsg = message.trim();
    setMessage("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, context }),
      });
      const json = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: json.answer }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Error: ${e.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await sendVoice(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch (e) {
      addToMessages("(voice)", `Microphone error: ${e.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setLoading(true);
    }
  };

  const sendVoice = async (blob) => {
    const formData = new FormData();
    formData.append("audio", blob, "voice.webm");
    formData.append("context", context);

    try {
      const res = await fetch(`${API_BASE}/voice-chat`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Voice chat failed");
      addToMessages(json.question, json.answer);

      if ("speechSynthesis" in window && json.answer) {
        const utterance = new SpeechSynthesisUtterance(json.answer);
        utterance.rate = 0.95;
        speechSynthesis.speak(utterance);
      }
    } catch (e) {
      addToMessages("(voice)", `Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl border border-slate-700/50 bg-slate-900/50"
    >
      <div className="border-b border-slate-700/50 p-4">
        <h2 className="text-lg font-semibold text-white">Chat about this video</h2>
        <p className="text-sm text-slate-400">
          Ask questions via text or voice
        </p>
        {/* Mode toggle */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setInputMode("text")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              inputMode === "text"
                ? "bg-brand-500 text-white"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            Text
          </button>
          <button
            onClick={() => setInputMode("voice")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              inputMode === "voice"
                ? "bg-brand-500 text-white"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            Voice
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-slate-500">
            {inputMode === "text"
              ? "Type a question about the video."
              : "Hold the button and ask your question aloud."}
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2 ${
                m.role === "user"
                  ? "bg-brand-500/20 text-brand-100"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-slate-800 px-4 py-2 text-slate-400">
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-700/50 p-4">
        {inputMode === "text" ? (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendText()}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
            <button
              onClick={sendText}
              disabled={loading || !message.trim()}
              className="rounded-lg bg-brand-500 px-4 py-2 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={recording ? stopRecording : undefined}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={loading}
              className={`flex h-20 w-20 items-center justify-center rounded-full font-medium transition ${
                recording
                  ? "animate-pulse-slow bg-red-500/80 text-white"
                  : "bg-brand-500 text-white hover:bg-brand-600"
              } ${loading ? "opacity-50" : ""}`}
            >
              {recording ? "Speaking…" : "Hold to talk"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
