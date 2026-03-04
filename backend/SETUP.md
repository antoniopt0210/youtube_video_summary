# Backend Setup

## Python Version

**Use Python 3.11 or 3.12.** Python 3.14 is not yet supported by `pydantic-core` (no pre-built wheels).

## Steps

1. **Install Python 3.12** (if needed): https://www.python.org/downloads/

2. **Create venv with Python 3.12:**
   ```powershell
   cd backend
   # Remove old venv if it exists
   Remove-Item -Recurse -Force .venv -ErrorAction SilentlyContinue
   # Create new venv with Python 3.12
   py -3.12 -m venv .venv
   # Or if you have python3.12 explicitly:
   # python3.12 -m venv .venv
   ```

3. **Activate** (PowerShell may require execution policy change first):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   .venv\Scripts\activate
   ```

4. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

5. **Configure .env** with your `OPENAI_API_KEY`
