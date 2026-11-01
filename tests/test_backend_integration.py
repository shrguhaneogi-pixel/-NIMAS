"""
Integration test for Ánimas FastAPI backend.
"""
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

import main
from schemas import QueryMemoriesRequest, IngestDocumentRequest

def run_coro(coro):
    try:
        coro.send(None)
    except StopIteration as e:
        return e.value
    raise RuntimeError("Coroutine did not finish on first tick")

def run_tests():
    print("Testing health endpoint...")
    health = run_coro(main.health_check())
    assert health["status"] == "ok", "Health status failed"
    print("Health check OK.")

    print("Testing document ingestion...")
    ingest_req = IngestDocumentRequest(
        title="Receta de Mole",
        filename="mole.md",
        content="Abuela Elena usaba cuatro chiles secos: ancho, pasilla, mulato y chipotle en su mole."
    )
    doc = run_coro(main.ingest_memory(ingest_req))
    assert doc.source_id.startswith("mem_"), "Invalid source_id"
    print(f"Ingested document: {doc.source_id}")

    print("Testing query endpoint...")
    query_req = QueryMemoriesRequest(question="mole chilies", top_k=2)
    res = run_coro(main.query_memories(query_req))
    assert res.answer.status == "answered", f"Expected answered status, got {res.answer.status}"
    assert len(res.retrievals) > 0, "No retrievals returned"
    assert res.retrievals[0].chunk.chunk_id, "Missing chunk.chunk_id"
    assert res.retrievals[0].source.source_id, "Missing source.source_id"
    print(f"Retrieved: {res.retrievals[0].chunk.chunk_id} - Tone: {res.visual_direction.memory_tone}")

    print("ALL PYTHON BACKEND INTEGRATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
