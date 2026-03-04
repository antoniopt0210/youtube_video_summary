"""
YouTube Video Summary API
"""
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend directory (works regardless of cwd)
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from app.routers import summarize, chat, voice

app = FastAPI(
    title="YouTube Video Summary API",
    description="Extract transcripts, generate AI summaries, and chat about YouTube videos with voice support.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Ensure all errors return JSON, never plain text."""
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "error": "Internal server error"},
    )


app.include_router(summarize.router, prefix="/api", tags=["summarize"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(voice.router, prefix="/api", tags=["voice"])

# Serve frontend static files (when built)
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"


@app.get("/api")
def api_info():
    return {
        "message": "YouTube Video Summary API",
        "docs": "/docs",
        "endpoints": ["/api/summarize", "/api/chat", "/api/voice-chat"],
    }


if STATIC_DIR.exists():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve SPA: static files or index.html for client-side routes."""
        if full_path.startswith("api"):
            return JSONResponse({"detail": "Not found"}, status_code=404)
        file_path = STATIC_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        index_path = STATIC_DIR / "index.html"
        if index_path.exists():
            return FileResponse(index_path)
        return JSONResponse({"detail": "Not found"}, status_code=404)
else:
    @app.get("/")
    def root():
        return {
            "message": "YouTube Video Summary API",
            "docs": "/docs",
            "endpoints": ["/api/summarize", "/api/chat", "/api/voice-chat"],
        }
