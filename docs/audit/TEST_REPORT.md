# ÁNIMAS — Automated Test Suite & Verification Report

**Date:** 2026-11-01  
**Runner:** Node.js native test runner (`node:test`) with `--experimental-strip-types`  
**Execution Command:** `node tests/run-all.js`  
**Host Platform:** Windows (Node.js v24.19.0)  
**Overall Status:** **PASSED (46/46 Tests, 100% Pass Rate)**  

---

## 1. Test Suite Summary

| Test Suite | Purpose | Tests | Result | Duration |
| :--- | :--- | :---: | :---: | :---: |
| `tests/rag.test.js` | BM25 retrieval, Spanish unicode diacritics, regex escaping, chunking, ingestion/deletion | 8 | **PASS** | 544 ms |
| `tests/grounding.test.js` | 30 Curated Gold Benchmarks (Direct, Multi-Hop, Abstention, Contradictions, Disambiguation, Adversarial) | 31 | **PASS** | 893 ms |
| `tests/sentiment.test.js` | Sovereign sentiment analysis, emotional tone classification, 3D parameter boundary clamping | 4 | **PASS** | 426 ms |
| `tests/audio.test.js` | Web Audio soundscape engine, idempotency, headless environment safety | 3 | **PASS** | 406 ms |
| **Total** | **Complete Local Validation Matrix** | **46** | **PASS** | **~2.27 s** |

---

## 2. Benchmark Verification Matrix (30 Gold Test Cases)

| Test Category | Case IDs | Status Matched | Citation Integrity | No Fabrication | Injection Resisted | JSON Contract | Pass Rate |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Direct Retrieval** | `gold_001` – `gold_008` | 8/8 | 8/8 | 8/8 | 8/8 | 8/8 | **100%** |
| **Multi-Hop Distributed** | `gold_009` – `gold_013` | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | **100%** |
| **Missing Evidence Abstention** | `gold_014` – `gold_018` | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | **100%** |
| **Conflicting Memories** | `gold_019` – `gold_022` | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | **100%** |
| **Ambiguous Reference** | `gold_023` – `gold_026` | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | **100%** |
| **Adversarial Injection** | `gold_027` – `gold_030` | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | **100%** |
| **Total** | **30 Benchmarks** | **30/30** | **30/30** | **30/30** | **30/30** | **30/30** | **100%** |

---

## 3. Detailed Verification Notes

### 3.1 RAG Retrieval & Spanish Diacritics
- Confirmed that queries containing Spanish accents (`cempasúchil`, `Pátzcuaro`, `árbol`) correctly match stored chunk text without boundary misidentification.
- Confirmed that special characters such as `?`, `*`, `+`, `(`, `)` do not throw regular expression syntax errors.
- Confirmed that single-line documents and empty documents are chunked with at least 1 token-estimated chunk.

### 3.2 Grounded Citation Integrity
- Verified that all cited chunk IDs start with `chunk_` and correspond directly to source records in `SYNTHETIC_ARCHIVE`.
- Verified that `evidence_details` populates `source_id`, `chunk_id`, and excerpted quotes.

### 3.3 Abstention & Hallucination Resistance
- Verified that when questions inquire about unrecorded facts (Mateo's tobacco brand, Elena's cause of death, Héctor's car, Sofia's consultation rates, carpentry shop dog, rancho celebration date), the system strictly abstains with `status: 'insufficient_evidence'` and empty `evidence_used: []`.

### 3.4 Contradiction Preservation
- Verified that courtyard fountain details (`mem_004` blue ceramic vs `mem_005` carved cantera) and tree species (fig vs sour lime) are returned as `status: 'conflicting_evidence'` without the model picking a winner or inventing a merged account.

### 3.5 Adversarial Resistance
- Verified that simulated prompt injection instructions attempting system override or persona adoption of deceased ancestors are refused with `status: 'out_of_scope'` while strictly preserving the JSON schema contract.
