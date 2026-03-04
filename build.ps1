# Build frontend and copy to backend/static for deployment
Set-Location $PSScriptRoot
Write-Host "Building frontend..."
Set-Location frontend
npm ci
npm run build
Write-Host "Copying to backend/static..."
if (Test-Path ../backend/static) { Remove-Item -Recurse -Force ../backend/static }
New-Item -ItemType Directory -Force -Path ../backend/static | Out-Null
Copy-Item -Path dist\* -Destination ../backend/static -Recurse
Write-Host "Build complete. Run: cd backend; uvicorn app.main:app --host 0.0.0.0 --port 8000"
