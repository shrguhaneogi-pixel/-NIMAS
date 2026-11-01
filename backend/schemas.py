"""
ÁNIMAS: The Sovereign 3D Ofrenda — Canonical Pydantic v2 Data Models
Strictly typed contracts matching Ánimas Prompt Suite and Frontend Interfaces.
"""

from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field

class MemoryDocument(BaseModel):
    source_id: str
    title: str
    original_filename: str
    source_date: Optional[str] = None
    language: str = "es-MX"
    heading: Optional[str] = None
    source_type: str = "archival_record"
    people_as_written: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    content: str

class GroundedAnswerResponse(BaseModel):
    schema_version: Literal["1.0"] = "1.0"
    reasoning_scratchpad: str = Field(description="Chain-of-thought verifying evidence and checking for conflicts")
    status: Literal["answered", "insufficient_evidence", "conflicting_evidence", "out_of_scope"]
    answer: str
    evidence_used: List[str] = Field(default_factory=list)
    uncertainty: Optional[Dict[str, Any]] = None

class SovereignSentimentResponse(BaseModel):
    reasoning_scratchpad: str
    memory_tone: Literal["joyful", "somber", "reflective", "neutral", "mixed"]
    tone_confidence: float = Field(ge=0.0, le=1.0)
    visual_intensity: float = Field(ge=0.0, le=1.0)
    lighting_profile: Literal["warm_candle", "soft_candle", "subdued_amber", "balanced_warm", "neutral"]
    particle_profile: Literal["none", "petal_drift", "dust_motes", "gentle_drift"]
    camera_motion: Literal["static", "slow_drift"]

class QueryMemoriesRequest(BaseModel):
    question: str
    top_k: int = Field(default=4, ge=1, le=20)
    client_state: Optional[Dict[str, Any]] = None

class MemoryChunkItem(BaseModel):
    chunk_id: str
    source_id: str
    chunk_index: int = 0
    content: str
    token_estimate: int = 0

class RetrievalResultItem(BaseModel):
    chunk: MemoryChunkItem
    source: MemoryDocument
    score: float = 1.0
    matched_terms: List[str] = Field(default_factory=list)

class QueryMemoriesResponse(BaseModel):
    answer: GroundedAnswerResponse
    retrievals: List[RetrievalResultItem] = Field(default_factory=list)
    visual_direction: SovereignSentimentResponse

class IngestDocumentRequest(BaseModel):
    title: str
    filename: str
    content: str
    source_date: Optional[str] = None
    language: Optional[str] = "es-MX"
    heading: Optional[str] = None
    people_as_written: Optional[List[str]] = Field(default_factory=list)
    tags: Optional[List[str]] = Field(default_factory=list)

class PurgeRequest(BaseModel):
    confirmation_phrase: str = Field(description="Must match 'PURGE_ANCESTRAL_RECORD' to execute")
    source_id: Optional[str] = None

class PurgeResponse(BaseModel):
    status: Literal["purged", "rejected"]
    documents_deleted: int
    chunks_deleted: int
    message: str
