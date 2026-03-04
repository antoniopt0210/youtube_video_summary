#!/bin/bash
# Build frontend and copy to backend/static for deployment
set -e
cd "$(dirname "$0")"
echo "Building frontend..."
cd frontend
npm ci
npm run build
echo "Copying to backend/static..."
rm -rf ../backend/static
mkdir -p ../backend/static
cp -r dist/* ../backend/static/
echo "Build complete. Run: cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000"
