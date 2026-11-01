# ÁNIMAS — Evidence-Based Findings Register

**Auditor:** Principal Software Architect & QA Automation Team  
**Evaluation Date:** 2026-11-01  
**Total Identified Findings:** 16  
**Status Key:** `Open` | `In Progress` | `Resolved` | `Verified`  

---

## 1. Findings Summary by Severity

| Severity Level | Definition | Count |
| :--- | :--- | :--- |
| **P0 — Critical** | Data-loss risk, security vulnerability, application-breaking failure | 0 |
| **P1 — High** | Major functional defect, broken core workflow, memory leak, GC thrashing | 4 |
| **P2 — Medium** | Build reproducibility, dependency inconsistency, missing tests, docs | 8 |
| **P3 — Low** | Unnecessary per-frame work, missing types, minor edge cases | 3 |
| **P4 — Optional** | Dead code deprecation, future enhancement | 1 |

---

## 2. Detailed Findings Register

| ID | Category | Finding | Evidence & File Location | Severity | Confidence | Proposed Action | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A-001** | RAG / AI | Spanish unicode word boundary failure and unescaped regex characters in BM25 search | `src/services/ragEngine.ts:180` (`new RegExp('\\b' + token)`) | **P1** | High | Replace ASCII `\b` with unicode-safe boundary check and escape regex characters | Open |
| **A-002** | 3D Graphics | Unbounded 4,800 Object3D allocations/sec in 60 FPS animation loop | `src/components/ThreeOfrenda/OfrendaCanvas.tsx:484-489` | **P1** | High | Hoist `_petalDummy` to module scope to eliminate per-frame GC thrashing | Open |
| **A-003** | 3D Graphics | WebGL memory leak: unmanaged GPU geometries & materials on scene re-mount | `src/components/ThreeOfrenda/OfrendaCanvas.tsx:264-267` | **P1** | High | Implement cleanup `useEffect` disposing `graph.disposables` and unlinking scene objects | Open |
| **A-004** | AI / Grounding | Incomplete citation metadata and fragile query matching in simulator | `src/services/gemmaSimulator.ts:133-214` | **P1** | High | Ensure `evidence_details` populates properly, and extend gold case domain coverage | Open |
| **A-005** | Testing | Zero automated tests in repository despite existing 30 gold benchmarks | Repository root (No test suite or runner) | **P2** | High | Implement deterministic automated test suite using `node:test` covering RAG & grounding | Open |
| **A-006** | Frontend | Reactive cursor effect re-mounting on pointer movements | `src/components/Cursor/CustomSanctuaryCursor.tsx:260` | **P2** | High | Remove `isVisible` from effect dependencies; track state via refs | Open |
| **A-007** | Audio / Media | AudioAmbienceEngine leaks audio nodes & intervals on multiple starts | `src/services/audioAmbience.ts:34-76` | **P2** | High | Add idempotency guard `if (this.isPlaying) return;` at entry of `start()` | Open |
| **A-008** | Build | Non-existent TypeScript version declared in package manifest | `package.json:39` (`"typescript": "^7.0.2"`) | **P2** | High | Correct TypeScript version to valid stable release (`^5.7.2`) | Open |
| **A-009** | Build | Non-portable clean script fails natively on Windows | `package.json:10` (`"clean": "rm -rf dist server.js"`) | **P2** | High | Replace with cross-platform Node.js cleanup script | Open |
| **A-010** | Release | Missing project package name and metadata | `package.json:2` (`"react-example"`) | **P2** | High | Update to `"animas-sovereign-ofrenda"`, version `"0.1.0"` | Open |
| **A-011** | Release | Missing LICENSE file in root despite Apache-2.0 file headers | Repository root | **P2** | High | Add official Apache License 2.0 file | Open |
| **A-012** | Release | Missing root documentation (`README.md`, `ARCHITECTURE.md`, `SECURITY.md`) | Repository root & `docs/` | **P2** | High | Create comprehensive documentation suite reflecting actual codebase | Open |
| **A-013** | CI/CD | Missing automated GitHub Actions validation workflow | `.github/workflows/` missing | **P2** | High | Add `.github/workflows/ci.yml` validating install, test, lint, and build | Open |
| **A-014** | 3D Graphics | Inefficient traversal of idle relic meshes 60 times/sec | `src/components/ThreeOfrenda/InteractiveRelic.tsx:80-100` | **P3** | High | Add early exit when `currentIntensity === 0 && targetIntensity === 0` | Open |
| **A-015** | TypeScript | Loose `any` event types on 3D relic pointer handlers | `src/components/ThreeOfrenda/InteractiveRelic.tsx:102,107,113` | **P3** | High | Type event handlers properly with `@react-three/fiber` event types | Open |
| **A-016** | Code Quality | Duplicate precursor component `CompanionDrawer.tsx` | `src/components/CompanionDrawer.tsx` | **P4** | Medium | Preserve component while annotating deprecation notice in favor of `InquestDrawer` | Open |
