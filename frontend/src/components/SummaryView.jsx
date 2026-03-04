import { motion } from "framer-motion";

export default function SummaryView({ data }) {
  const { video_id, embed_url, summary, keywords, entities, transcript_source } = data;

  return (
    <div className="space-y-8">
      {/* Transcript source badge */}
      {transcript_source === "whisper" && (
        <p className="text-sm text-amber-400/90">
          Transcript via Whisper (captions unavailable for this video)
        </p>
      )}

      {/* Video embed */}
      <div className="aspect-video overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
        <iframe
          src={embed_url}
          title="YouTube video"
          className="h-full w-full"
          allowFullScreen
        />
      </div>

      {/* Overview */}
      {summary?.overview && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-6"
        >
          <h2 className="mb-3 text-lg font-semibold text-white">Overview</h2>
          <p className="text-slate-300 leading-relaxed">{summary.overview}</p>
        </motion.section>
      )}

      {/* Key points */}
      {summary?.key_points?.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-6"
        >
          <h2 className="mb-3 text-lg font-semibold text-white">Key Points</h2>
          <ul className="space-y-2">
            {summary.key_points.map((point, i) => (
              <li key={i} className="flex gap-2 text-slate-300">
                <span className="text-brand-500">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      {/* Chapters */}
      {summary?.chapters?.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-6"
        >
          <h2 className="mb-3 text-lg font-semibold text-white">Chapters</h2>
          <div className="flex flex-wrap gap-2">
            {summary.chapters.map((ch, i) => (
              <span
                key={i}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-slate-300"
              >
                {Array.isArray(ch) ? `${ch[0]} ${ch[1]}` : ch}
              </span>
            ))}
          </div>
        </motion.section>
      )}

      {/* NLP: Keywords & Entities */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid gap-4 sm:grid-cols-2"
      >
        {keywords?.length > 0 && (
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              NLP Keywords
            </h2>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="rounded-md bg-brand-500/20 px-2 py-1 text-sm text-brand-400"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
        {entities?.length > 0 && (
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Entities
            </h2>
            <div className="flex flex-wrap gap-2">
              {entities.map((e, i) => (
                <span
                  key={i}
                  className="rounded-md bg-slate-700/50 px-2 py-1 text-sm text-slate-300"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
}
