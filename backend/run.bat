@echo off
REM Only watch app/ dir - avoids .venv and prevents constant restarts
uvicorn app.main:app --reload --port 8000 --reload-dir app
