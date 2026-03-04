"""Fetch YouTube video transcripts. Falls back to Whisper if captions fail."""
import os
import re
import shutil
import xml.etree.ElementTree as ET
from typing import Optional

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
)

from app.services.audio_download import download_audio
from app.services.voice import transcribe_audio_file


def extract_video_id(url: str) -> Optional[str]:
    """Extract YouTube video ID from URL."""
    patterns = [
        r"(?:youtube\.com/watch\?v=)([a-zA-Z0-9_-]{11})",
        r"(?:youtu\.be/)([a-zA-Z0-9_-]{11})",
        r"(?:youtube\.com/embed/)([a-zA-Z0-9_-]{11})",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return url if len(url) == 11 and url.replace("-", "").replace("_", "").isalnum() else None


def get_transcript(video_id: str, url: str | None = None) -> tuple[list[dict], str, str]:
    """
    Fetch transcript for a YouTube video.
    Tries youtube-transcript-api first; on failure, downloads audio and uses Whisper.
    Returns (segments, full_text, source) where source is "youtube" or "whisper".
    """
    # 1. Try YouTube captions first (cookies help with bot detection)
    cookies_path = os.getenv("YT_DLP_COOKIES")
    cookies = cookies_path if cookies_path and os.path.isfile(cookies_path) else None
    try:
        transcript_list = (
            YouTubeTranscriptApi.get_transcript(video_id, cookies=cookies)
            if cookies
            else YouTubeTranscriptApi.get_transcript(video_id)
        )
        segments = [
            {"start": s["start"], "duration": s["duration"], "text": s["text"]}
            for s in transcript_list
        ]
        full_text = " ".join(s["text"] for s in transcript_list)
        return segments, full_text, "youtube"
    except (TranscriptsDisabled, NoTranscriptFound, VideoUnavailable, ET.ParseError, Exception):
        pass  # Fall through to Whisper

    # 2. Fallback: download audio and transcribe with Whisper
    if not os.getenv("OPENAI_API_KEY"):
        raise ValueError(
            "Transcript fetch failed and Whisper fallback requires OPENAI_API_KEY."
        )

    audio_path = None
    try:
        video_url = url or f"https://www.youtube.com/watch?v={video_id}"
        audio_path = download_audio(video_id, video_url)
        full_text = transcribe_audio_file(audio_path)
    except Exception as e:
        err = str(e)
        if "Sign in to confirm" in err or "bot" in err.lower() or "cookies" in err.lower():
            raise ValueError(
                "This video couldn't be processed (YouTube restriction). Try a video with captions, or a different video."
            )
        raise ValueError(
            f"Transcript fetch failed and Whisper fallback failed: {err}"
        )
    finally:
        if audio_path and os.path.exists(audio_path):
            try:
                shutil.rmtree(os.path.dirname(audio_path), ignore_errors=True)
            except OSError:
                pass

    if not full_text or len(full_text.strip()) < 10:
        raise ValueError("Whisper returned empty or too short transcript.")

    # Whisper doesn't give timestamps in simple mode; create placeholder segments
    segments = [{"start": 0.0, "duration": 0.0, "text": full_text}]
    return segments, full_text, "whisper"
