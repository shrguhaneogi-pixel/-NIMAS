# ÁNIMAS — Remediation Roadmap & Implementation Plan

**Date:** 2026-11-01  
**Auditor:** Principal Software Architect  
**Strategy:** Phased, atomic, verified commits adhering strictly to the **Plan → Implement → Inspect → Test → Validate → Commit** protocol.

---

## 1. Remediation Phases & Ordering

Prioritization strictly follows the master audit guidelines:
1. **Phase 1: Core Algorithmic & Retrieval Fixes** (RAG Spanish tokenization & regex safety)
2. **Phase 2: 3D Performance, Memory Safety & Audio Stability** (Petal allocations, WebGL disposal, cursor effect, audio leak)
3. **Phase 3: AI Grounding, Citation Integrity & Defense Hardening** (Gemma simulator grounding, evidence details, adversarial boundaries)
4. **Phase 4: Automated Testing Suite & Test Verification** (Node.js test suite for RAG, benchmarks, sentiment, audio)
5. **Phase 5: Security & Privacy Audit Verification** (Input boundaries, local-first guarantees, secret prevention)
6. **Phase 6: Build Hygiene, Dependencies & Manifest Packaging** (Package.json, clean scripts, Apache 2.0 license, git attributes/ignore)
7. **Phase 7: Comprehensive Documentation Suite** (README.md, ARCHITECTURE.md, CONTRIBUTING.md, SECURITY.md, CHANGELOG.md)
8. **Phase 8: CI/CD GitHub Actions Configuration & Final Release Audit** (ci.yml, release verification)

---

## 2. Detailed Work Breakdown by Phase

### Phase 1: Core Retrieval Engine Remediation (Finding A-001)
- **Files Modified:** `src/services/ragEngine.ts`
- **Objective:** Fix Spanish unicode character matching and prevent unhandled regex errors.
- **Approach:**
  - Introduce `escapeRegExp(str)` helper for safe token regex generation.
  - Implement unicode-aware token boundary matching so Spanish accented words (`árbol`, `época`, `último`, `niño`) match accurately.
  - Validate empty text ingestion handling.
- **Verification:** Unit test checking Spanish accented words and special punctuation queries.
- **Risk:** Low. Public interface remains identical.

### Phase 2: 3D Performance, Memory Safety & Audio Stability (Findings A-002, A-003, A-006, A-007, A-014, A-015)
- **Files Modified:**
  - `src/components/ThreeOfrenda/OfrendaCanvas.tsx`
  - `src/components/ThreeOfrenda/InteractiveRelic.tsx`
  - `src/components/Cursor/CustomSanctuaryCursor.tsx`
  - `src/services/audioAmbience.ts`
- **Objectives:**
  - Eliminate 4,800 Object3D allocations/sec by hoisting `_petalDummy`.
  - Add WebGL geometry and material cleanup effect on scene unmount.
  - Stabilize `CustomSanctuaryCursor` effect by removing `isVisible` from dependency array.
  - Prevent concurrent `AudioAmbienceEngine.start()` invocations from leaking audio nodes.
  - Skip unnecessary object tree traversals on idle relics.
- **Verification:** Manual inspect of code diff and component lifecycle checks.
- **Risk:** Low. Visual presentation and interactions preserved.

### Phase 3: AI Grounding & Citation Integrity (Finding A-004)
- **Files Modified:**
  - `src/services/gemmaSimulator.ts`
  - `src/services/MockAnimasAIAdapter.ts`
- **Objectives:**
  - Populate `evidence_details` containing structured `GroundedEvidence` entries.
  - Refine abstention thresholds to properly abstain on ungrounded queries.
  - Expand domain coverage for multi-hop queries matching synthetic archive records.
  - Verify strict clamp on visual parameter outputs in adapter.
- **Verification:** Execute all 30 Gold Test Cases against the engine.
- **Risk:** Low. Schema contracts preserved.

### Phase 4: Deterministic Automated Test Suite (Finding A-005)
- **Files Created:**
  - `tests/rag.test.js`
  - `tests/grounding.test.js`
  - `tests/sentiment.test.js`
  - `tests/run-all.js`
  - `docs/audit/TEST_REPORT.md`
- **Objectives:**
  - Implement automated headless test runners using Node.js 24 native `node:test` and `node:assert`.
  - Validate BM25 retrieval, Spanish accents, phrase boosting, document ingestion/deletion.
  - Validate all 30 Gold Benchmarks (direct, distributed, missing evidence, conflicting accounts, ambiguous reference, adversarial injection).
  - Validate sovereign sentiment engine visual parameter mapping and boundary checks.
- **Verification:** `node --test tests/*.test.js`.
- **Risk:** None. Adds testing infrastructure without affecting production code.

### Phase 5: Security & Privacy Hardening
- **Files Created:**
  - `docs/audit/SECURITY_AUDIT.md`
- **Objectives:**
  - Review secrets, local service exposure, local-first privacy guarantees, untrusted archive ingestion boundaries.
- **Verification:** Static audit and documentation.

### Phase 6: Build Hygiene & Repository Configuration (Findings A-008, A-009, A-010, A-011)
- **Files Created/Modified:**
  - `package.json`
  - `LICENSE`
  - `.editorconfig`
  - `.gitattributes`
  - `.gitignore`
- **Objectives:**
  - Update `name` to `"animas-sovereign-ofrenda"`, version to `"0.1.0"`.
  - Correct `"typescript": "^5.7.2"`.
  - Add cross-platform clean script and test runner script.
  - Add Apache 2.0 license.
  - Configure line endings, editor config, and gitignore.

### Phase 7: Comprehensive Documentation Suite (Finding A-012)
- **Files Created:**
  - `README.md`
  - `docs/ARCHITECTURE.md`
  - `CONTRIBUTING.md`
  - `SECURITY.md`
  - `CHANGELOG.md`

### Phase 8: CI/CD Workflow & Final Verification (Finding A-013)
- **Files Created:**
  - `.github/workflows/ci.yml`
- **Objectives:**
  - Automated GitHub Actions workflow testing Node install, test execution, and build.
- **Verification:** Run complete release audit.
