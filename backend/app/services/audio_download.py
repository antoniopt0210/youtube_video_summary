"""Download YouTube audio using yt-dlp for Whisper fallback."""
import os
import tempfile
from pathlib import Path

import yt_dlp


def download_audio(video_id: str, url: str | None = None) -> str:
    """
    Download audio from YouTube video.
    Returns path to the downloaded audio file (m4a, webm, or mp3).
    """
    video_url = url or f"https://www.youtube.com/watch?v={video_id}"
    out_dir = tempfile.mkdtemp()
    out_path = os.path.join(out_dir, f"{video_id}.%(ext)s")

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": out_path,
        "quiet": True,
        "no_warnings": True,
        "extract_audio": False,  # Get raw audio stream, no FFmpeg needed
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(video_url, download=True)
        if not info:
            raise ValueError("Could not extract video info")

    # Find the downloaded file (yt-dlp may use different extensions)
    downloaded = list(Path(out_dir).glob(f"{video_id}.*"))
    if not downloaded:
        raise ValueError("Audio file was not created")
    return str(downloaded[0])
