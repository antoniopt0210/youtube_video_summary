"""Summarization endpoints."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.transcript import extract_video_id, get_transcript
from app.services.summarizer import summarize_transcript
from app.services.nlp import extract_keywords, extract_entities_simple

router = APIRouter()


class SummarizeRequest(BaseModel):
    url: str


@router.post("/summarize")
def summarize_video(req: SummarizeRequest):
    """Fetch transcript and generate AI summary with NLP keywords."""
    video_id = extract_video_id(req.url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")

    try:
        segments, full_text, source = get_transcript(video_id, req.url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    summary = summarize_transcript(full_text, title=f"Video {video_id}")
    keywords = extract_keywords(full_text)
    entities = extract_entities_simple(full_text)

    return {
        "video_id": video_id,
        "embed_url": f"https://www.youtube.com/embed/{video_id}",
        "transcript_source": source,  # "youtube" or "whisper"
        "transcript_length": len(full_text),
        "segments": segments[:50],  # First 50 for preview
        "summary": summary,
        "keywords": keywords,
        "entities": entities,
        "full_transcript": full_text[:5000],  # Truncated for response size
    }
