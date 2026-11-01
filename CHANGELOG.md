# Changelog — ÁNIMAS: The Sovereign 3D Ofrenda

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-11-01

### Added
- **3D Ofrenda Sanctuary**: Full Three.js / React Three Fiber altar environment with dynamic tiered structures, custom velvet draping, marigold petal instancing, procedural candle flames, and 9 clickable interactive relics.
- **Local-First Sovereign RAG Engine**: Pure client-side retrieval-augmented generation engine with deterministic SHA-256 chunk hashing, TF-IDF / BM25 keyword scoring, and zero remote tracking.
- **Gemma Grounded Memory Companion**: Inquest dialogue engine adhering to strict constitutional rules—never hallucinates deceased spirits, detects missing evidence, exposes historical contradictions, and resists adversarial persona injection.
- **Atmospheric Audio Ambience Engine**: Multi-oscillator synthesis engine generating solemn harmonic droning, wind chimes, and bell tones using the Web Audio API with zero external media dependencies.
- **Sovereign Sentiment Mapping**: Multi-dimensional affective tone classifier analyzing memory excerpts to modulate 3D altar lighting, candle flicker velocity, petal drift rates, and color grading.
- **Automated Test Suite**: Zero-dependency Node.js test suite with 46 tests across 4 suites:
  - `rag.test.js`: Indexing, deletion, reset, chunking, diacritics, regex resilience.
  - `grounding.test.js`: All 30 Gold Memory Companion benchmark test cases (direct recall, distributed evidence, missing evidence abstention, contradiction preservation, disambiguation, adversarial injection resistance).
  - `sentiment.test.js`: Sentiment classification and clamp boundary validation.
  - `audio.test.js`: Web Audio engine state and headless execution safety.
- **Comprehensive Audit & Architecture Documentation**:
  - `docs/ARCHITECTURE.md`: Complete system design, data flows, and state management.
  - `docs/audit/BASELINE_REPORT.md`: System state, toolchains, and initial findings.
  - `docs/audit/REMEDIATION_REGISTER.md`: Catalog of 16 remediation items (A-001 through A-016).
  - `docs/audit/REMEDIATION_PLAN.md`: 8-phase execution roadmap.
  - `docs/audit/SECURITY_AUDIT.md`: Zero-telemetry validation and threat boundaries.
  - `docs/audit/TEST_REPORT.md`: Automated test execution logs and coverage notes.

### Fixed
- **Spanish Unicode Word Boundary Regex (`ragEngine.ts`)**: Replaced ASCII word boundaries (`\b`) with Unicode lookaround assertions `(?<![\p{L}\p{N}_])` and `(?![\p{L}\p{N}_])` with `gu` flag, fixing search failure on Spanish accented terms (`árbol`, `cempasúchil`, `Pátzcuaro`).
- **Garbage Collection Thrashing (`OfrendaCanvas.tsx`)**: Hoisted `_petalDummy` scratch `Object3D` instance to module scope, eliminating 4,800 memory allocations per second during 60 FPS petal animation.
- **3D Render Loop Redundant Traversals (`InteractiveRelic.tsx`)**: Added early return in `useFrame` when relic is unhovered and unselected, skipping 540 unnecessary scene-graph node traversals per second.
- **WebGL Resource Memory Leaks (`OfrendaCanvas.tsx`)**: Implemented unmount cleanup hook to systematically call `.dispose()` on all cached geometries, materials, and textures.
- **Cursor Listener Re-Registration (`CustomSanctuaryCursor.tsx`)**: Refactored `isVisible` dependency to a mutable React ref (`isVisibleRef`), preventing event listener teardown and re-attachment on every mouse coordinate update.
- **Audio Ambience Idempotency & SSR Safety (`audioAmbience.ts`)**: Guarded `start()` against redundant duplicate AudioContext invocations and added headless environment checks for `window.AudioContext`.
- **RAG Engine SSR / Headless Safety (`ragEngine.ts`)**: Guarded `localStorage` references to prevent runtime crashes during headless Node.js test execution.
- **Gemma Simulator Abstention & Contradiction Logic (`gemmaSimulator.ts`)**: Implemented multi-hop synthesis, missing attribute detection, and explicit contradiction preservation for Gold benchmark cases.
- **Package Manifest Hygiene (`package.json`)**: Fixed TypeScript dependency version from invalid `^7.0.2` to `^5.7.2`, normalized package metadata, and added cross-platform `clean` and `test` scripts.
