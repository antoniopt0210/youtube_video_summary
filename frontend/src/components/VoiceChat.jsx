import { useState, useRef } from "react";
import { motion } from "framer-motion";

const API_BASE = "/api";

export default function VoiceChat({ context }) {
  const [recording, setRecording] = useState(false);
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

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
        await sendAudio(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setAnswer("");
      setQuestion("");
    } catch (e) {
      setAnswer(`Microphone error: ${e.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setLoading(true);
    }
  };

  const sendAudio = async (blob) => {
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
      setQuestion(json.question);
      setAnswer(json.answer);

      // Optional: speak the answer using Web Speech API
      if ("speechSynthesis" in window && json.answer) {
        const utterance = new SpeechSynthesisUtterance(json.answer);
        utterance.rate = 0.95;
        speechSynthesis.speak(utterance);
      }
    } catch (e) {
      setAnswer(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-6"
    >
      <h2 className="mb-2 text-lg font-semibold text-white">Voice Chat</h2>
      <p className="mb-6 text-sm text-slate-400">
        Hold the button, ask a question about the video, then release. Your
        question will be transcribed and answered with text-to-speech.
      </p>

      <div className="flex flex-col items-center gap-6">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={recording ? stopRecording : undefined}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          disabled={loading}
          className={`flex h-24 w-24 items-center justify-center rounded-full font-medium transition ${
            recording
              ? "animate-pulse-slow bg-red-500/80 text-white"
              : "bg-brand-500 text-white hover:bg-brand-600"
          } ${loading ? "opacity-50" : ""}`}
        >
          {recording ? "Speaking…" : "Hold to talk"}
        </button>

        {question && (
          <div className="w-full rounded-lg bg-slate-800 p-4">
            <p className="text-xs font-medium uppercase text-slate-500">
              Your question
            </p>
            <p className="mt-1 text-slate-200">{question}</p>
          </div>
        )}

        {(answer || loading) && (
          <div className="w-full rounded-lg bg-slate-800 p-4">
            <p className="text-xs font-medium uppercase text-slate-500">
              Answer
            </p>
            <p className="mt-1 text-slate-200">
              {loading ? "Processing…" : answer}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
