"""Voice chat: transcribe audio and generate LLM response."""
import os
import tempfile
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def transcribe_audio(audio_bytes: bytes, filename: str = "audio.webm") -> str:
    """Transcribe audio bytes using Whisper API."""
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as f:
        f.write(audio_bytes)
        path = f.name
    try:
        return transcribe_audio_file(path)
    finally:
        os.unlink(path)


def transcribe_audio_file(file_path: str) -> str:
    """Transcribe audio file using Whisper API. Supports mp3, m4a, webm, wav, etc."""
    with open(file_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
        )
    return transcript.text


def chat_with_context(question: str, context: str, max_tokens: int = 500) -> str:
    """Answer question based on video transcript context."""
    prompt = f"""You are a helpful assistant. Answer the user's question based ONLY on the following video transcript. If the answer is not in the transcript, say so.

Transcript:
---
{context[:8000]}
---

Question: {question}

Answer concisely:"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=0.3,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"
