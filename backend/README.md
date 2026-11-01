# ÁNIMAS — FastAPI Sovereign Intelligence Daemon

The sovereign local AI daemon for **ÁNIMAS: The Sovereign 3D Ofrenda**.

## Overview
This service provides local RAG querying, vector search via `sqlite-vec`, Gemma 2B/9B reasoning chains, and 3D ofrenda visual direction mapping.

## Running Locally

### Option 1: With `uv` (Recommended)
```bash
cd backend
uv sync
uv run uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### Option 2: With Standard Python
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt  # or: pip install fastapi uvicorn pydantic python-multipart httpx
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### Option 3: Docker Container
```bash
docker build -t animas-backend .
docker run -p 8000:8000 animas-backend
```

Or from repository root:
```bash
docker compose up --build
```

## Cloud Deployment (Render / Railway)
- **Render**: Connect the repository and select `render.yaml`.
- **Railway**: Deploy using the Dockerfile located in `backend/Dockerfile`.
- Set `ALLOWED_ORIGINS` to include your Vercel deployment domain (e.g. `https://animas-sovereign-ofrenda.vercel.app`).
