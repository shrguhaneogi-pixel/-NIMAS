"""
ÁNIMAS: The Sovereign 3D Ofrenda — Database Layer
Manages local SQLite database with optional sqlite-vec extension loading.
Guarantees ACID transactions and sovereign on-disk persistence.
"""

import os
import sqlite3
import json
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("animas.db")

def init_db(db_path: Optional[str] = None) -> sqlite3.Connection:
    """
    Initializes SQLite database with schema tables for documents and chunks.
    Attempts to load sqlite-vec extension; if unavailable, falls back to standard SQLite.
    """
    if not db_path:
        db_path = os.getenv("DATABASE_PATH") or ("data/animas_sovereign.db" if os.path.exists("data") else "animas_sovereign.db")

    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        try:
            os.makedirs(db_dir, exist_ok=True)
        except Exception:
            pass

    db = sqlite3.connect(db_path, check_same_thread=False)
    db.row_factory = sqlite3.Row

    # Attempt sqlite-vec extension loading
    vec_loaded = False
    try:
        import sqlite_vec
        db.enable_load_extension(True)
        sqlite_vec.load(db)
        db.enable_load_extension(False)
        vec_loaded = True
        logger.info("Successfully loaded sqlite-vec dynamic extension.")
    except Exception as e:
        logger.warning(f"sqlite-vec extension not loaded: {e}. Operating in standard SQLite mode.")

    cursor = db.cursor()

    # Core document storage
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS memory_documents (
            source_id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            original_filename TEXT,
            source_date TEXT,
            language TEXT DEFAULT 'es-MX',
            heading TEXT,
            source_type TEXT DEFAULT 'archival_record',
            people_as_written TEXT,
            tags TEXT,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # Chunk storage (standard table)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS memory_chunks (
            chunk_id TEXT PRIMARY KEY,
            source_id TEXT NOT NULL,
            chunk_index INTEGER NOT NULL,
            title TEXT,
            content TEXT NOT NULL,
            FOREIGN KEY (source_id) REFERENCES memory_documents(source_id) ON DELETE CASCADE
        );
    """)

    # Vector table if sqlite-vec is available
    if vec_loaded:
        try:
            cursor.execute("""
                CREATE VIRTUAL TABLE IF NOT EXISTS vec_memory_chunks USING vec0(
                    chunk_id TEXT PRIMARY KEY,
                    source_id TEXT,
                    chunk_index INTEGER,
                    content TEXT,
                    embedding float[384]
                );
            """)
        except Exception as e:
            logger.warning(f"Could not initialize vec0 virtual table: {e}")

    db.commit()
    return db

class DatabaseManager:
    def __init__(self, db_path: Optional[str] = None):
        self.db = init_db(db_path)

    def insert_document(self, doc_data: Dict[str, Any]) -> Dict[str, Any]:
        cursor = self.db.cursor()
        source_id = doc_data["source_id"]
        people_json = json.dumps(doc_data.get("people_as_written", []))
        tags_json = json.dumps(doc_data.get("tags", []))

        cursor.execute("""
            INSERT OR REPLACE INTO memory_documents (
                source_id, title, original_filename, source_date,
                language, heading, source_type, people_as_written, tags, content
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            source_id,
            doc_data["title"],
            doc_data.get("original_filename", ""),
            doc_data.get("source_date"),
            doc_data.get("language", "es-MX"),
            doc_data.get("heading"),
            doc_data.get("source_type", "archival_record"),
            people_json,
            tags_json,
            doc_data["content"]
        ))

        # Basic paragraph chunking
        content = doc_data["content"]
        paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
        if not paragraphs:
            paragraphs = [content.strip()]

        # Clear previous chunks for this source
        cursor.execute("DELETE FROM memory_chunks WHERE source_id = ?", (source_id,))

        for idx, para in enumerate(paragraphs):
            chunk_id = f"{source_id}_chunk_{idx + 1:03d}"
            cursor.execute("""
                INSERT INTO memory_chunks (chunk_id, source_id, chunk_index, title, content)
                VALUES (?, ?, ?, ?, ?)
            """, (chunk_id, source_id, idx, doc_data["title"], para))

        self.db.commit()
        return doc_data

    def get_document(self, source_id: str) -> Optional[Dict[str, Any]]:
        cursor = self.db.cursor()
        cursor.execute("SELECT * FROM memory_documents WHERE source_id = ?", (source_id,))
        row = cursor.fetchone()
        if not row:
            return None
        doc = dict(row)
        doc["people_as_written"] = json.loads(doc["people_as_written"]) if doc.get("people_as_written") else []
        doc["tags"] = json.loads(doc["tags"]) if doc.get("tags") else []
        return doc

    def get_all_documents(self) -> List[Dict[str, Any]]:
        cursor = self.db.cursor()
        cursor.execute("SELECT * FROM memory_documents ORDER BY created_at DESC")
        rows = cursor.fetchall()
        results = []
        for r in rows:
            doc = dict(r)
            doc["people_as_written"] = json.loads(doc["people_as_written"]) if doc["people_as_written"] else []
            doc["tags"] = json.loads(doc["tags"]) if doc["tags"] else []
            results.append(doc)
        return results

    def delete_document(self, source_id: str) -> bool:
        cursor = self.db.cursor()
        cursor.execute("DELETE FROM memory_chunks WHERE source_id = ?", (source_id,))
        cursor.execute("DELETE FROM memory_documents WHERE source_id = ?", (source_id,))
        self.db.commit()
        return cursor.rowcount > 0

    def purge_all(self) -> tuple[int, int]:
        cursor = self.db.cursor()
        cursor.execute("SELECT COUNT(*) FROM memory_documents")
        doc_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM memory_chunks")
        chunk_count = cursor.fetchone()[0]

        cursor.execute("DELETE FROM memory_chunks")
        cursor.execute("DELETE FROM memory_documents")
        self.db.commit()
        return doc_count, chunk_count

    def search_chunks(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        cursor = self.db.cursor()
        # Case-insensitive keyword matching
        words = [w.strip() for w in query.lower().split() if len(w.strip()) > 2]
        if not words:
            cursor.execute("SELECT * FROM memory_chunks LIMIT ?", (top_k,))
            rows = cursor.fetchall()
            return [{
                "chunk_id": r["chunk_id"],
                "source_id": r["source_id"],
                "title": r["title"],
                "content": r["content"],
                "chunk_index": r["chunk_index"],
                "score": 1.0,
                "source": r["content"],
                "matched_terms": []
            } for r in rows]

        # Score matching
        cursor.execute("SELECT * FROM memory_chunks")
        all_chunks = cursor.fetchall()
        scored = []
        for c in all_chunks:
            text = (c["content"] + " " + (c["title"] or "")).lower()
            matched = [w for w in words if w in text]
            if matched:
                scored.append({
                    "chunk_id": c["chunk_id"],
                    "source_id": c["source_id"],
                    "title": c["title"],
                    "content": c["content"],
                    "chunk_index": c["chunk_index"],
                    "score": float(len(matched)),
                    "source": c["content"],
                    "matched_terms": matched
                })

        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]
