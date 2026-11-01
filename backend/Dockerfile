# ==============================================================================
# ÁNIMAS: The Sovereign 3D Ofrenda — Production Container Image
# Multi-stage lightweight Python image for FastAPI, sqlite-vec, and local RAG
# ==============================================================================

FROM python:3.11-slim-bullseye AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies required for SQLite and compiled extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    sqlite3 \
    libsqlite3-dev \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv package manager
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy dependency specifications
COPY pyproject.toml .

# Install dependencies including sqlite-vec
RUN uv pip install --system fastapi uvicorn pydantic sqlite-vec python-multipart httpx

# Copy backend application source
COPY . /app/backend
WORKDIR /app

# Create persistent data volume directory and non-root user for container security
RUN mkdir -p /app/data && useradd -m -u 1000 animas && chown -R animas:animas /app
USER animas

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
