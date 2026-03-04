# YouTube Video Summary [(click for demo)](https://youtube-video-summary-pjnw.onrender.com)

A web app that summarizes YouTube videos (English only) with AI. Paste a URL to get a summary, key points, chapters, and chat about the video via text or voice.

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
