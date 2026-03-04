"""Text chat endpoint for Q&A about the video."""
from fastapi import APIRouter
from pydantic import BaseModel

from app.services.voice import chat_with_context

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    context: str  # Transcript or summary


@router.post("/chat")
def chat(req: ChatRequest):
    """Answer questions about the video based on transcript context."""
    if not req.message.strip():
        return {"answer": "Please provide a question."}
    answer = chat_with_context(req.message, req.context)
    return {"answer": answer}
