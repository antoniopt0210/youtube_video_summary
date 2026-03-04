# YouTube Video Summary

A web app that summarizes YouTube videos with AI. Paste a URL to get a summary, key points, chapters, and chat about the video via text or voice.

![Tech Stack](https://img.shields.io/badge/GenAI-LLM%20%7C%20NLP%20%7C%20Voice-orange)

## Features

| Feature | Description |
|---------|-------------|
| **Transcript Extraction** | Fetch captions from any YouTube video (no API key required) |
| **LLM Summarization** | GPT-4 powered overview, key points, and chapter detection |
| **NLP Processing** | Keyword extraction and entity recognition from transcript |
| **Text Chat** | Ask questions about the video and get contextual answers |
| **Voice Chat** | Speak your question → Whisper transcribes → LLM answers → TTS speaks |

## Tech Stack

- **Backend**: FastAPI, youtube-transcript-api, OpenAI (GPT-4 + Whisper)
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Voice**: Web Speech API (browser) + Whisper API (transcription) + Speech Synthesis (TTS)

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux

pip install -r requirements.txt
cp .env.example .env
# Add your OPENAI_API_KEY to .env

uvicorn app.main:app --reload --port 8000 --reload-dir app
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Open

Visit **http://localhost:5173** and paste a YouTube URL.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | For GPT-4 summarization, chat, and Whisper transcription |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/summarize` | `{ "url": "..." }` → transcript + AI summary + keywords |
| POST | `/api/chat` | `{ "message": "...", "context": "..." }` → LLM answer |
| POST | `/api/voice-chat` | `audio` file + `context` form data → transcribed question + answer |

API docs: **http://localhost:8000/docs**

## Project Structure

```
youtube_video_summary/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app
│   │   ├── routers/          # summarize, chat, voice
│   │   └── services/         # transcript, summarizer, nlp, voice
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/       # SummaryView, TextChat, VoiceChat
│   └── package.json
└── README.md
```

## Portfolio Highlights

- **GenAI**: LLM-powered summarization and conversational Q&A
- **LLM**: Prompt engineering, structured output, context window management
- **NLP**: Keyword extraction, entity recognition, topic modeling
- **Voice**: Speech-to-text (Whisper), text-to-speech (Web Speech API), voice-first UX

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/youtube_video_summary.git
git push -u origin main
```

Create the repo on [GitHub](https://github.com/new) first (don't initialize with README if you already have one).

## Deploy to the Web

### Option 1: Render (recommended)

1. **Push to GitHub** – Use the steps above.
2. **Go to [Render](https://render.com)** → New → Web Service.
3. **Connect your GitHub repo**.
4. **Configure:**
   - **Environment**: Docker
   - **Build**: Uses the `Dockerfile` in the repo
   - **Environment variables**: Add `OPENAI_API_KEY` (from [OpenAI](https://platform.openai.com/api-keys))
5. **Deploy** – Render will build and deploy. You’ll get a URL like `https://youtube-video-summary.onrender.com`.

### Option 2: Railway

1. Push to GitHub.
2. Go to [Railway](https://railway.app) → New Project → Deploy from GitHub.
3. Select your repo. Railway will detect the Dockerfile.
4. Add `OPENAI_API_KEY` in Variables.
5. Deploy and use the generated URL.

### Option 3: Run locally and share (ngrok)

```bash
# Build and run
./build.ps1   # Windows
# or ./build.sh   # macOS/Linux

cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Then use [ngrok](https://ngrok.com) to expose it: `ngrok http 8000`.

---

**Note:** Free tiers may spin down after inactivity. Add billing or use a paid plan for always-on hosting.

## License

MIT
