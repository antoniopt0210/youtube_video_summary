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
        "extract_audio": False,
        # Reduce bot detection: use mobile client + browser-like headers
        "extractor_args": {"youtube": {"player_client": ["android", "web"]}},
        "http_headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
        },
    }

    # Use cookies to bypass "Sign in to confirm you're not a bot"
    cookies_from_browser = os.getenv("YT_DLP_COOKIES_FROM_BROWSER")  # e.g. "chrome", "firefox"
    cookies_path = os.getenv("YT_DLP_COOKIES")  # path to cookies.txt (Netscape format)
    if cookies_from_browser:
        ydl_opts["cookiesfrombrowser"] = (cookies_from_browser.split(",")[0].strip(),)
    elif cookies_path and os.path.isfile(cookies_path):
        ydl_opts["cookiefile"] = cookies_path

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(video_url, download=True)
        if not info:
            raise ValueError("Could not extract video info")

    # Find the downloaded file (yt-dlp may use different extensions)
    downloaded = list(Path(out_dir).glob(f"{video_id}.*"))
    if not downloaded:
        raise ValueError("Audio file was not created")
    return str(downloaded[0])
