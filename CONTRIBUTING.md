# Contributing to ÁNIMAS — The Sovereign 3D Ofrenda

Thank you for your interest in contributing to **ÁNIMAS: The Sovereign 3D Ofrenda**. This project is a local-first, privacy-preserving memorial sanctuary blending Día de los Muertos traditions with zero-telemetry architecture and grounded local AI.

## Core Architectural Principles

1. **Sovereignty & Privacy**: All personal family archival data stays in the user's browser / local machine. No tracking telemetry, no unsolicited cloud uploads, no persistent remote telemetry.
2. **Strict Grounding**: The AI companion acts solely as an archival retrieval interpreter, never hallucinating deceased personas or fabricating facts outside the provided archive.
3. **Immersive Performance**: The Three.js / React Three Fiber 3D scene must maintain 60 FPS on standard consumer hardware without garbage collection thrashing or memory leaks.

---

## Development Prerequisites

- **Node.js**: `v20.x` or `v22.x` or `v24.x` (LTS recommended)
- **npm**: `v10.x` or `v11.x`
- Modern WebGL2-compatible browser (Chrome, Edge, Firefox, Brave)

---

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/animas.git
   cd animas
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```
   *Note: Due to peer dependency ranges between React 19 and `@react-three/fiber` / Three.js, `--legacy-peer-deps` is required.*

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

---

## Testing & Quality Assurance

All PRs must maintain 100% test pass rates across the automated test suites:

- **Run master test suite**:
  ```bash
  npm test
  ```
  This runs all 4 suites via Node.js native ESM:
  - `tests/rag.test.js`: Local RAG indexing, chunking, Spanish diacritics lookarounds, regex escaping.
  - `tests/grounding.test.js`: Validates all 30 Gold Benchmarks (direct recall, multi-hop distributed evidence, abstention, contradiction preservation, disambiguation, adversarial prompt injection defense).
  - `tests/sentiment.test.js`: Emotional tone extraction and 3D visual parameter boundary clamping.
  - `tests/audio.test.js`: Ambience synthesis and headless environment resilience.

- **Type Checking**:
  ```bash
  npm run lint
  ```

---

## Coding Standards

### TypeScript & React
- Use React 19 functional components with hooks.
- Use explicit file extensions in internal relative imports (e.g., `import { ... } from './ragEngine.ts'`) to ensure compatibility with Node.js native ESM test runners.
- When importing interfaces and types that do not have runtime value representations, always use `import type { ... }` so Node.js `--experimental-strip-types` can strip them cleanly.
- Avoid inline object/vector allocations inside high-frequency render loops (such as `useFrame` in Three.js components). Hoist temporary scratch objects (`THREE.Vector3`, `THREE.Object3D`) to module scope.

### Internationalization & Text
- Support Spanish accented vowels (`á`, `é`, `í`, `ó`, `ú`, `ü`, `ñ`) in all text analysis, RAG matching, and UI typography.
- Never use ASCII `\b` for word boundaries on multilingual text; use Unicode property escapes `(?<![\p{L}\p{N}_])` and `(?![\p{L}\p{N}_])` with flag `u`.

---

## Pull Request Guidelines

1. **Branch Naming**: Use descriptive prefixes:
   - `feat/feature-name`
   - `fix/bug-description`
   - `perf/optimization-target`
   - `docs/documentation-update`
2. **Test Coverage**: If modifying RAG logic or prompt reasoning, add corresponding test cases to `tests/`.
3. **Verification**: Verify that `npm test` and `npm run build` pass with zero errors before submitting.
