# ÁNIMAS — Baseline Engineering Audit Report

**Date:** 2026-11-01  
**Auditor:** Principal Software Architect & Senior Engineering Team  
**Repository Identity:** `animas-sovereign-ofrenda` (formerly `react-example`)  
**Active Branch:** `main`  
**Initial Commit Hash:** `425f8c9`  

---

## 1. Executive Summary

This baseline report documents the initial state of the Ánimas repository before controlled remediation. Ánimas is designed as a local-first, privacy-preserving interactive 3D digital memorial ofrenda inspired by Día de los Muertos and the "Ghost in the Machine" paradigm.

The current codebase is an in-browser client-side application built with **React 19**, **Vite 8**, **Tailwind CSS v4**, **Three.js (0.187.0)**, and **React Three Fiber / Drei**. It features an interactive 3D altar with procedural pixel-art dithering and shader materials, an in-memory/localStorage BM25 archival retrieval engine, a simulated local Gemma 2B/9B grounded answerer with Chain-of-Thought (CoT) scratchpads, a sovereign sentiment visual engine, a benchmark audit studio with 30 gold test cases, and a Python backend code scaffolding exporter.

---

## 2. Environment & Tooling Verification

| Tool / Runtime | Detected Status | Version | Verified Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | Available | `v24.19.0` | Native strip-types support available |
| **npm** | Available | `11.17.0` | Package manager |
| **Python** | Available | `3.14.0` | Core runtime (fastapi, pydantic, uvicorn, uv installed) |
| **uv** | Available | `0.12.19` | Fast Python package manager |
| **Bun** | Not Installed | N/A | `bun.lock` exists in root, but bun executable absent |
| **Git** | Available | Git for Windows | Clean working tree on `main` |

---

## 3. Repository State at Inspection

### 3.1 Git Status & Commit History
```
Current branch: main
Latest commit: 425f8c9 feat(ui): implement pixel-art typography and design system
Prior commit:  4ce0779 feat: initialize project scaffold
Initial:       b218f52 Initial commit
Working Tree:  Clean (0 modified, 0 staged, 0 untracked files before audit)
```

### 3.2 File Structure Overview
- `src/App.tsx`: Main navigation container orchestrating 5 tab views and global audio/cursor overlays.
- `src/components/Navigation/`: Top navigation bar (`TopNavbar.tsx`) and left rail.
- `src/components/ThreeOfrenda/`: 3D canvas (`OfrendaCanvas.tsx`), interactive relics (`InteractiveRelic.tsx`), procedural scene builder (`sceneBuilder.ts`), and 16-bit dithered texture generator (`proceduralTextures.ts`).
- `src/components/Tabs/`:
  - `SovereignSanctuaryTab.tsx`: 3D Canvas + floating control dock + offering inspector.
  - `ArchiveExplorerTab.tsx`: Document browser, paragraph chunk viewer, and memory ingestion form.
  - `AuditStudioTab.tsx`: 30-case hallucination and adversarial injection benchmark matrix.
  - `ScaffoldExporterTab.tsx`: Scaffolding generator for future standalone Python FastAPI backend.
  - `Phase3BlueprintTab/`: Full architectural specification and verification checklist.
- `src/services/`:
  - `ragEngine.ts`: In-browser BM25 term retrieval and document chunking.
  - `gemmaSimulator.ts`: Grounded answering, abstention, contradiction preservation, and sentiment analysis.
  - `MockAnimasAIAdapter.ts`: Adapter layer bridging UI and local AI services.
  - `audioAmbience.ts`: Web Audio API synthetic ambient sound generator.
- `src/data/syntheticArchive.ts`: 12 fictional Mexican family memory documents and 30 curated gold benchmark test cases.

---

## 4. Initial Deficiencies and Failure Modes Identified

### 4.1 Dependency & Manifest Inconsistencies
1. **Invalid TypeScript Version**: `package.json` declares `"typescript": "^7.0.2"`. TypeScript 7 does not exist; attempting to install dependencies via standard package managers fails.
2. **Missing Project Metadata**: `package.json` is named `"react-example"`, version `"0.0.0"`.
3. **Non-Portable Clean Script**: `"clean": "rm -rf dist server.js"` fails natively on Windows environments without bash.
4. **Missing Test Script**: No `npm test` script is defined in `package.json`.
5. **Missing License File**: Files declare `Apache-2.0` in headers, but no `LICENSE` file exists in the repository root.
6. **Missing GitHub Community Files**: No `README.md`, `docs/ARCHITECTURE.md`, `CONTRIBUTING.md`, `SECURITY.md`, or `CHANGELOG.md`.
7. **Missing CI Workflow**: No GitHub Actions workflows exist in `.github/workflows/`.

### 4.2 Critical Runtime & Algorithmic Deficiencies
1. **Spanish Accent Retrieval Bug (`src/services/ragEngine.ts`)**:
   Line 180 uses `new RegExp('\\b' + token, 'g')`. In JavaScript RegExp, standard ASCII `\b` fails on Spanish words starting with accented vowels (`á, é, í, ó, ú, ü, ñ`), such as `árbol`, `época`, and `último`. Furthermore, unescaped regex special characters throw `SyntaxError`.
2. **Per-Frame Object3D Churn in 3D Render Loop (`src/components/ThreeOfrenda/OfrendaCanvas.tsx`)**:
   Lines 484–489 instantiate `new THREE.Object3D()` inside the 60 FPS animation loop for each of the 80 instanced petals (4,800 allocations/second), causing severe garbage collection pressure and frame jitter.
3. **WebGL Memory Leak on Scene Reload (`src/components/ThreeOfrenda/OfrendaCanvas.tsx`)**:
   `buildOfrendaScene` accumulates meshes, geometries, and materials in `graph.disposables`, but `OfrendaCanvas.tsx` has no disposal cleanup on unmount, resulting in orphaned GPU allocations when switching tabs.
4. **Custom Cursor Event Churn (`src/components/Cursor/CustomSanctuaryCursor.tsx`)**:
   The primary `useEffect` has `[isVisible]` in its dependency array. Every time pointer movement toggles visibility, the entire effect tears down, removes window listeners, cancels the rAF loop, and re-allocates ember particle pools.
5. **Web Audio Multiple-Start Node Leak (`src/services/audioAmbience.ts`)**:
   `AudioAmbienceEngine.start()` lacks an idempotency check, leaking audio nodes and compounding volume when triggered repeatedly.
6. **Zero Automated Tests**:
   No automated test files existed in the repository despite the presence of 30 curated gold benchmark test cases.

---

## 5. Baseline Test Execution Results

- **Unit Tests:** None existed in the repository.
- **Type Checking:** `tsc --noEmit` could not be executed directly due to uninstalled local `node_modules` and missing global `tsc`.
- **Frontend Build:** Pending dependency resolution.
- **Backend Startup:** No backend service currently exists; backend logic is simulated in the client adapter.
- **In-Browser Gold Benchmark:** 30 benchmark test cases are implemented within `AuditStudioTab.tsx` and will be ported to an automated headless test runner using Node.js 24 native test runner (`node:test`).
