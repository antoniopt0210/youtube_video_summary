"""Voice chat: transcribe audio and return LLM answer."""
from fastapi import APIRouter, File, Form, UploadFile, HTTPException

from app.services.voice import transcribe_audio, chat_with_context

router = APIRouter()


@router.post("/voice-chat")
async def voice_chat(
    audio: UploadFile = File(...),
    context: str = Form(...),
):
    """
    Accept audio file (webm/mp3/m4a), transcribe with Whisper,
    then answer based on transcript context.
    """
    if not context or len(context.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail="Context (transcript) is required for voice chat.",
        )

    content = await audio.read()
    if len(content) < 100:
        raise HTTPException(status_code=400, detail="Audio file too small.")

    try:
        question = transcribe_audio(content, audio.filename or "audio.webm")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

    if not question.strip():
        return {"question": "", "answer": "Could not understand the audio."}

    answer = chat_with_context(question, context)
    return {"question": question, "answer": answer}
