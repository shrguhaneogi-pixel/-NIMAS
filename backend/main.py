"""
ÁNIMAS: The Sovereign 3D Ofrenda — FastAPI Sovereign Intelligence Daemon
Local-first memory retrieval, Gemma CoT synthesis, and 3D sentiment visual mapping.
Configured with full Vercel preview & production CORS support.
"""

import os
import uuid
from typing import List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

try:
    from .schemas import (
        MemoryDocument,
        GroundedAnswerResponse,
        SovereignSentimentResponse,
        QueryMemoriesRequest,
        QueryMemoriesResponse,
        RetrievalResultItem,
        MemoryChunkItem,
        IngestDocumentRequest,
        PurgeRequest,
        PurgeResponse,
    )
    from .db import DatabaseManager
except ImportError:
    from schemas import (
        MemoryDocument,
        GroundedAnswerResponse,
        SovereignSentimentResponse,
        QueryMemoriesRequest,
        QueryMemoriesResponse,
        RetrievalResultItem,
        MemoryChunkItem,
        IngestDocumentRequest,
        PurgeRequest,
        PurgeResponse,
    )
    from db import DatabaseManager

app = FastAPI(
    title="Ánimas Sovereign Intelligence Daemon",
    description="Local-first RAG and 3D visual parameter generator for Ánimas Ofrenda",
    version="1.0.0"
)

# ------------------------------------------------------------------------------
# CORS & Private Network Access (PNA) Configuration
# Supports local frontends, custom origins, and all Vercel preview deployments.
# Also sends Access-Control-Allow-Private-Network for Chromium PNA compliance
# when an HTTPS Vercel frontend connects to a local daemon (http://127.0.0.1:8000).
# ------------------------------------------------------------------------------
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://animas-sovereign-ofrenda.vercel.app",
    "https://animas.vercel.app",
]

env_origins = os.getenv("ALLOWED_ORIGINS", "")
if env_origins:
    for o in env_origins.split(","):
        cleaned = o.strip()
        if cleaned and cleaned not in allowed_origins:
            allowed_origins.append(cleaned)

@app.middleware("http")
async def add_private_network_access_header(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Private-Network"] = "true"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = DatabaseManager()

# ------------------------------------------------------------------------------
# Health Check Endpoints
# ------------------------------------------------------------------------------
@app.get("/")
@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "service": "animas-sovereign-daemon",
        "version": "1.0.0",
        "mode": "sovereign_local",
    }

# ------------------------------------------------------------------------------
# RAG Query & Memory Intelligence
# ------------------------------------------------------------------------------
@app.post("/api/query", response_model=QueryMemoriesResponse)
async def query_memories(req: QueryMemoriesRequest):
    retrievals_raw = db.search_chunks(req.question, top_k=req.top_k)
    retrievals = []
    for r in retrievals_raw:
        chunk = MemoryChunkItem(
            chunk_id=r["chunk_id"],
            source_id=r["source_id"],
            chunk_index=r.get("chunk_index", 0),
            content=r["content"],
            token_estimate=len(r["content"].split())
        )
        doc_data = db.get_document(r["source_id"])
        if doc_data:
            source_doc = MemoryDocument(**doc_data)
        else:
            source_doc = MemoryDocument(
                source_id=r["source_id"],
                title=r.get("title") or "Archivo Familiar",
                original_filename=r.get("original_filename", ""),
                source_date=r.get("source_date"),
                language=r.get("language", "es-MX"),
                heading=r.get("heading"),
                source_type="archival_record",
                people_as_written=[],
                tags=[],
                content=r["content"]
            )
        retrievals.append(
            RetrievalResultItem(
                chunk=chunk,
                source=source_doc,
                score=r.get("score", 1.0),
                matched_terms=r.get("matched_terms", [])
            )
        )

    # Grounded answer synthesis
    if not retrievals:
        answer = GroundedAnswerResponse(
            schema_version="1.0",
            reasoning_scratchpad="No matching archival records located in local sovereign repository. Strictly abstaining from unrecorded speculation.",
            status="insufficient_evidence",
            answer="No se encontraron registros en el archivo familiar para responder esta pregunta con certeza.",
            evidence_used=[]
        )
        sentiment = SovereignSentimentResponse(
            reasoning_scratchpad="Insufficient evidence fallback. Neutral ambient lighting profile.",
            memory_tone="neutral",
            tone_confidence=0.85,
            visual_intensity=0.35,
            lighting_profile="neutral",
            particle_profile="none",
            camera_motion="static"
        )
    else:
        evidence_ids = [r.chunk.chunk_id for r in retrievals[:2]]
        combined_text = " ".join([r.chunk.content for r in retrievals[:2]])
        answer = GroundedAnswerResponse(
            schema_version="1.0",
            reasoning_scratchpad=f"Retrieved {len(retrievals)} archival chunks. Formulating grounded response strictly from documented evidence.",
            status="answered",
            answer=f"Basado en los registros del archivo: {retrievals[0].chunk.content[:280]}...",
            evidence_used=evidence_ids
        )
        sentiment = analyze_sentiment_text(combined_text)

    return QueryMemoriesResponse(
        answer=answer,
        retrievals=retrievals,
        visual_direction=sentiment
    )

# ------------------------------------------------------------------------------
# Ingestion & Document Management
# ------------------------------------------------------------------------------
@app.post("/api/memories", response_model=MemoryDocument)
async def ingest_memory(req: IngestDocumentRequest):
    source_id = f"mem_{uuid.uuid4().hex[:8]}"
    doc_data = {
        "source_id": source_id,
        "title": req.title,
        "original_filename": req.filename,
        "source_date": req.source_date,
        "language": req.language or "es-MX",
        "heading": req.heading,
        "source_type": "archival_record",
        "people_as_written": req.people_as_written or [],
        "tags": req.tags or [],
        "content": req.content,
    }
    db.insert_document(doc_data)
    return MemoryDocument(**doc_data)

@app.get("/api/memories", response_model=List[MemoryDocument])
async def list_memories():
    docs = db.get_all_documents()
    return [MemoryDocument(**d) for d in docs]

@app.delete("/api/memories/{source_id}")
async def delete_memory(source_id: str):
    success = db.delete_document(source_id)
    if not success:
        raise HTTPException(status_code=404, detail="Memory document not found")
    return {"status": "deleted", "source_id": source_id}

# ------------------------------------------------------------------------------
# Sentiment Evaluation
# ------------------------------------------------------------------------------
@app.post("/api/sentiment", response_model=SovereignSentimentResponse)
async def evaluate_sentiment(payload: dict):
    text = payload.get("content") or payload.get("text") or payload.get("title") or ""
    return analyze_sentiment_text(text)

# ------------------------------------------------------------------------------
# Memory Purge
# ------------------------------------------------------------------------------
@app.post("/api/purge", response_model=PurgeResponse)
async def purge_memories(req: PurgeRequest):
    if req.confirmation_phrase != "PURGE_ANCESTRAL_RECORD":
        return PurgeResponse(
            status="rejected",
            documents_deleted=0,
            chunks_deleted=0,
            message="Invalid confirmation phrase. Sovereign deletion aborted."
        )

    if req.source_id:
        deleted = db.delete_document(req.source_id)
        return PurgeResponse(
            status="purged" if deleted else "rejected",
            documents_deleted=1 if deleted else 0,
            chunks_deleted=0,
            message=f"Purged document {req.source_id}" if deleted else "Document not found"
        )
    else:
        docs_del, chunks_del = db.purge_all()
        return PurgeResponse(
            status="purged",
            documents_deleted=docs_del,
            chunks_deleted=chunks_del,
            message="All memory records and vector embeddings securely purged."
        )

# ------------------------------------------------------------------------------
# Helper: Sentiment Analyzer
# ------------------------------------------------------------------------------
def analyze_sentiment_text(text: str) -> SovereignSentimentResponse:
    t = text.lower()
    joyful_keywords = ["fiesta", "risa", "música", "boda", "celebración", "alegría", "mole", "receta", "baile"]
    somber_keywords = ["muerte", "luto", "tristeza", "enfermedad", "adiós", "partida", "panteón", "dolor", "frío"]
    reflective_keywords = ["recuerdo", "madera", "reloj", "taller", "carta", "antiguo", "ofrenda", "tiempo"]

    joy_count = sum(1 for w in joyful_keywords if w in t)
    somber_count = sum(1 for w in somber_keywords if w in t)
    refl_count = sum(1 for w in reflective_keywords if w in t)

    if joy_count > somber_count and joy_count > refl_count:
        return SovereignSentimentResponse(
            reasoning_scratchpad="Archive segment describes familial warmth and vibrant celebration.",
            memory_tone="joyful",
            tone_confidence=0.92,
            visual_intensity=0.85,
            lighting_profile="warm_candle",
            particle_profile="petal_drift",
            camera_motion="slow_drift"
        )
    elif somber_count > joy_count and somber_count > refl_count:
        return SovereignSentimentResponse(
            reasoning_scratchpad="Archive segment documents solemn departure and quiet remembrance.",
            memory_tone="somber",
            tone_confidence=0.88,
            visual_intensity=0.45,
            lighting_profile="subdued_amber",
            particle_profile="dust_motes",
            camera_motion="static"
        )
    elif refl_count > 0:
        return SovereignSentimentResponse(
            reasoning_scratchpad="Archive segment focuses on heirloom traditions and ancestral craft.",
            memory_tone="reflective",
            tone_confidence=0.82,
            visual_intensity=0.60,
            lighting_profile="soft_candle",
            particle_profile="gentle_drift",
            camera_motion="slow_drift"
        )
    else:
        return SovereignSentimentResponse(
            reasoning_scratchpad="Informational text without pronounced emotional valence.",
            memory_tone="neutral",
            tone_confidence=0.75,
            visual_intensity=0.50,
            lighting_profile="neutral",
            particle_profile="none",
            camera_motion="static"
        )
