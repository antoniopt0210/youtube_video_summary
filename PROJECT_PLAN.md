# YouTube Video Summary App — Project Plan

A portfolio-ready web app showcasing **GenAI**, **LLM**, **NLP**, and **Voice Chat** capabilities.

---

## Core Features

| Feature | Tech | Description |
|---------|------|-------------|
| **Transcript Extraction** | youtube-transcript-api | Fetch captions from any YouTube video (no API key) |
| **LLM Summarization** | OpenAI / Anthropic / Gemini | Generate concise summaries, key takeaways, chapters |
| **NLP Processing** | spaCy / NLTK | Keyword extraction, named entities, topic clustering |
| **Voice Chat** | Web Speech API + Whisper | Ask questions about the video via voice, get spoken answers |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                    │
│  • Video URL input  • Summary display  • Voice chat interface   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ REST / WebSocket
┌───────────────────────────────▼─────────────────────────────────┐
│                     BACKEND (FastAPI)                             │
│  • /summarize     • /transcript  • /chat  • /voice-chat          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│  youtube-transcript-api │ LLM API (OpenAI) │ Whisper (optional)  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Backend
- **FastAPI** — async API, OpenAPI docs
- **youtube-transcript-api** — transcript fetching
- **openai** — GPT-4 for summarization & chat
- **spaCy** — NLP (keywords, entities)
- **python-multipart** — file upload for voice

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** — styling
- **Web Speech API** — browser voice input/output
- **Framer Motion** — animations

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/summarize` | `{ "url": "..." }` → full summary + key points |
| GET | `/api/transcript/{video_id}` | Raw transcript with timestamps |
| POST | `/api/chat` | `{ "message": "...", "context": "..." }` → LLM response |
| POST | `/api/voice-chat` | Audio file + context → transcribed question + LLM answer |

---

## Project Structure

```
youtube_video_summary/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── services/
│   │   │   ├── transcript.py
│   │   │   ├── summarizer.py
│   │   │   ├── nlp.py
│   │   │   └── voice.py
│   │   └── routers/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.ts
├── README.md
└── PROJECT_PLAN.md
```

---

## Implementation Phases

1. **Phase 1**: Backend — transcript + LLM summarization
2. **Phase 2**: Frontend — UI for input and summary display
3. **Phase 3**: Text chat — Q&A about the video
4. **Phase 4**: Voice chat — voice input + TTS response
5. **Phase 5**: Polish — README, env setup, deployment notes

---

## Environment Variables

```
OPENAI_API_KEY=sk-...
# Optional: ANTHROPIC_API_KEY, GOOGLE_API_KEY for alternatives
```

---

## Portfolio Highlights

- **GenAI**: LLM-powered summarization and conversational Q&A
- **LLM**: Prompt engineering, context window management
- **NLP**: Keyword extraction, entity recognition, topic modeling
- **Voice**: Speech-to-text, text-to-speech, voice-first UX
