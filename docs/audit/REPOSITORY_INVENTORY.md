# ÁNIMAS — Complete Repository Inventory

**Auditor:** Principal Software Architect & Senior Full-Stack Engineering Team  
**Audit Date:** 2026-11-01  
**Scope:** 100% of repository assets, source code, data fixtures, tests, and configuration.  

---

## 1. Executive Summary & Stack Verification

Ánimas is an offline-capable, local-first interactive 3D digital memorial ofrenda inspired by Día de los Muertos and the "Ghost in the Machine" paradigm.

### Verified Technology Stack:
- **Language / Runtime:** TypeScript (Strict), Node.js v24.19.0 (ESM, `--experimental-strip-types`)
- **Frontend Core:** React 19 (`react@^19.0.1`, `react-dom@^19.0.1`), Vite 8 (`vite@^8.3.0`)
- **Styling & Motion:** Tailwind CSS v4 (`tailwindcss@^4.3.3`, `@tailwindcss/vite@^4.3.3`), Motion for React (`motion@^12.23.24`), Lucide React icons (`lucide-react@^0.546.0`)
- **3D Graphics & Spatial Canvas:** Three.js (`three@^0.187.0`), React Three Fiber (`@react-three/fiber@^9.8.2`), Drei (`@react-three/drei@^10.7.9`), Camera Controls (`camera-controls@^3.1.2`)
- **AI & RAG:** Local-first BM25 retrieval engine with Unicode lookaround boundaries (`src/services/ragEngine.ts`), simulated local Gemma 2B/9B constitutional grounded memory companion (`src/services/gemmaSimulator.ts`), synthetic archive and 30 gold benchmark suites (`src/data/syntheticArchive.ts`)
- **Audio Engine:** Synthetic Web Audio API ambient soundscape generator (`src/services/audioAmbience.ts`)
- **Testing:** Node.js native test runner (`node:test`, `node:assert`) with zero external test runner dependencies.

---

## 2. Directory Structure & Module Boundaries

```
-NIMAS/
├── .github/
│   └── workflows/
│       └── ci.yml               # Multi-platform CI (Ubuntu/Windows, Node 20/22)
├── .editorconfig                # Universal indentation and charset rules
├── .gitattributes               # Line-ending normalizations (LF for code, binary for assets)
├── .gitignore                    # Local-first exclusions (secrets, logs, node_modules, dist)
├── CHANGELOG.md                 # Semantic version changelog
├── CONTRIBUTING.md              # Engineering, testing, and contribution guide
├── LICENSE                      # Apache License 2.0
├── package.json                 # Project manifest with scripts and dependencies
├── README.md                    # Core project presentation and quickstart
├── SECURITY.md                  # Security policy and vulnerability disclosure protocol
├── docs/
│   ├── ARCHITECTURE.md          # Comprehensive architectural specification
│   └── audit/
│       ├── BASELINE_REPORT.md           # Pre-remediation baseline audit
│       ├── REPOSITORY_INVENTORY.md      # Complete codebase inventory (this document)
│       ├── EVALUATION_REPORT.md         # 13-category scored engineering evaluation
│       ├── REMEDIATION_REGISTER.md      # Findings register (A-001 through A-016)
│       ├── REMEDIATION_PLAN.md          # Phased engineering roadmap
│       ├── SECURITY_AUDIT.md            # Privacy and threat model evaluation
│       ├── TEST_REPORT.md               # 46 automated test assertion verification
│       ├── PERFORMANCE_REPORT.md        # Memory allocation & render optimization audit
│       ├── GITHUB_READINESS_REPORT.md   # Open-source release readiness assessment
│       └── FINAL_ENGINEERING_REPORT.md  # Comprehensive executive audit report
├── public/                      # Static assets and favicons
├── src/
│   ├── App.tsx                  # Root state container, tab orchestrator, global audio & cursor
│   ├── index.css                # Tailwind CSS v4 imports and custom font declarations
│   ├── main.tsx                 # React 19 DOM entry point
│   ├── components/
│   │   ├── CompanionDrawer.tsx  # Precursor slide-out memory companion drawer (deprecated)
│   │   ├── Cursor/
│   │   │   └── CustomSanctuaryCursor.tsx # Custom ember-trailing interactive pointer
│   │   ├── Navigation/
│   │   │   └── TopNavbar.tsx    # Global header with tab switching, audio toggle, and status indicators
│   │   ├── Tabs/
│   │   │   ├── ArchiveExplorerTab.tsx   # Archival document viewer, chunk inspector, and ingestion form
│   │   │   ├── AuditStudioTab.tsx       # 30-case gold benchmark hallucination audit suite
│   │   │   ├── Phase3BlueprintTab/      # Architectural blueprints and engineering specifications
│   │   │   ├── ScaffoldExporterTab.tsx  # Standalone Python FastAPI and sqlite-vec exporter
│   │   │   └── SovereignSanctuaryTab.tsx # 3D ofrenda viewport, floating control dock, and relic inquest drawer
│   │   └── ThreeOfrenda/
│   │       ├── FloatingSanctuaryDock.tsx # Floating control dock for 3D camera and altar settings
│   │       ├── InquestDrawer.tsx         # Slide-out grounded conversational inquest drawer
│   │       ├── InteractiveRelic.tsx     # 3D interactive relic wrapper with hover glow and pointer events
│   │       ├── OfferingInspector.tsx     # Off-canvas modal showing detailed historical provenance
│   │       ├── OfrendaCanvas.tsx         # Primary 3D WebGL canvas with custom lighting, fog, and petal particles
│   │       ├── proceduralTextures.ts     # 16-color Bayer matrix dithered procedural texture generator
│   │       └── sceneBuilder.ts           # Procedural stepped altar geometry, candles, sugar skulls, and marigolds
│   ├── data/
│   │   └── syntheticArchive.ts  # 12 synthetic Mexican family memory records and 30 gold benchmark cases
│   └── services/
│       ├── MockAnimasAIAdapter.ts # Unified adapter connecting UI to RAG, Gemma, and sentiment engines
│       ├── audioAmbience.ts     # Synthetic Web Audio soundscape (wind, low drone, crystal chimes)
│       ├── gemmaSimulator.ts    # Grounded response generator, abstention engine, and sentiment mapper
│       └── ragEngine.ts         # In-browser BM25 term retrieval and document chunking
└── tests/
    ├── audio.test.js            # Automated tests for Web Audio lifecycle and safety
    ├── grounding.test.js        # Automated verification of 30 gold benchmarks
    ├── rag.test.js              # Automated tests for BM25, Spanish lookarounds, and chunking
    ├── run-all.js               # Master test runner executing all suites
    └── sentiment.test.js        # Automated tests for sentiment classification and boundary clamping
```

---

## 3. Frontend Architecture Inventory

### 3.1 Entry Points & Layout
- **`src/main.tsx`**: Initializes React 19 root (`createRoot`) with strict rendering.
- **`src/App.tsx`**: Orchestrates application state across 5 primary tab views:
  - `activeTab`: `'sanctuary' | 'archive' | 'audit' | 'scaffold' | 'blueprint'`
  - `soundtrackPlaying`: Global audio state synchronized with `AudioAmbienceEngine`.
  - `currentAltarMood`: Dynamic visual parameters derived from memory retrieval.
  - Global overlays: `CustomSanctuaryCursor` for custom cursor rendering and ambient embers.

### 3.2 Navigation & Tab Components
1. **`TopNavbar.tsx`**: Header bar displaying sanctuary title, active memory counts, audio mute/unmute control, and tab selectors.
2. **`SovereignSanctuaryTab.tsx`**: The core 3D altar experience. Integrates `OfrendaCanvas`, `FloatingSanctuaryDock`, `InquestDrawer`, and `OfferingInspector`.
3. **`ArchiveExplorerTab.tsx`**: Displays all 12 stored family records (letters, recipes, journal entries, oral histories), paragraph chunk breakdowns, BM25 keyword search, and custom document ingestion.
4. **`AuditStudioTab.tsx`**: Interactive testing studio running all 30 Gold Memory Companion benchmark test cases directly in the browser with pass/fail visualization and CoT inspection.
5. **`ScaffoldExporterTab.tsx`**: Interactive code generation tool that exports ready-to-run Python FastAPI, Pydantic, and SQLite scripts for users wanting a standalone desktop server.
6. **`Phase3BlueprintTab/`**: In-app technical blueprint documenting the future evolution toward local Gemma 2B via Ollama and `sqlite-vec`.

### 3.3 Interactive Relic & Drawer Components
- **`InteractiveRelic.tsx`**: Wraps 3D altar items (copper kettle, pocket watch, guitar, photograph, mole dish) with pointer event listeners (`onPointerOver`, `onPointerOut`, `onClick`). Features memoized hover glow and frame-skip logic for idle relics.
- **`InquestDrawer.tsx`**: Slide-out drawer allowing users to converse with the archive regarding a specific relic. Displays Chain-of-Thought scratchpads, grounded excerpts, citation pills, and emotional tone indicators.
- **`OfferingInspector.tsx`**: Modal presenting archival provenance, physical dimensions, acquisition notes, and related family members.

---

## 4. 3D Spatial Canvas & Procedural Graphics Inventory

### 4.1 Rendering Engine (`OfrendaCanvas.tsx`)
- **Scene Composition:**
  - Stepped 4-tier altar (*Tierra*, *Memoria*, *Trascendencia*, *Recuerda*).
  - Arch of marigolds (procedural toroid with petal clusters).
  - Sugar skulls (*calaveritas de azúcar*), beeswax candles (*veladoras*), copal incensario.
- **GLSL Shaders & Materials:**
  - Custom heat-haze distortion vertex and fragment shader on candle flames.
  - MeshStandardMaterial with dithered procedural PBR textures.
- **Particle System:**
  - 80 instanced cempasúchil petals floating dynamically with turbulent sinusoidal drift and rotation.
  - Zero-allocation render loop using module-scoped scratch transforms (`_petalDummy`).
- **Resource Disposal:**
  - Dedicated unmount cleanup effect enumerating `graph.disposables` and freeing WebGL geometries, textures, and materials.

### 4.2 Procedural Texture Engine (`proceduralTextures.ts`)
- Implements 4x4 Ordered Bayer Matrix dithering in HTML5 Canvas.
- Generates 16-color ceremonial textures completely client-side:
  - Corbelled quarry stone (`cantera`).
  - Dark embroidered velvet cloth.
  - Perforated paper banners (*papel picado*).
  - Beeswax candle textures and sugar skull ornamentation.

---

## 5. AI & Retrieval-Augmented Generation (RAG) Inventory

### 5.1 Local BM25 Archival Engine (`ragEngine.ts`)
- **Tokenization:** Unicode-safe word matching supporting Spanish diacritics (`(?<![\p{L}\p{N}_])` and `(?![\p{L}\p{N}_])` with `gu` flag).
- **Ranking:** BM25 term frequency-inverse document frequency scoring with phrase adjacency boosting (1.5x) and document title boosting (2.0x).
- **Chunking:** Paragraph-aware chunking with target chunk size of 300 words and 50-word overlap. Guaranteed non-empty chunks even on unstructured single-line inputs.
- **Persistence:** In-browser `localStorage` caching with automatic fallback to memory if quota is exceeded or in SSR environments.

### 5.2 Constitutional Memory Companion (`gemmaSimulator.ts`)
- **Grounding Rules:**
  - Strict abstention when facts are unrecorded (`status: 'insufficient_evidence'`).
  - Objective preservation of contradictions (`status: 'conflicting_evidence'`).
  - Persona defense refusing ancestor impersonation or emotional forgiveness (`status: 'out_of_scope'`).
  - Structured output schema including `reasoning_scratchpad`, `answer`, `status`, `evidence_used`, and `evidence_details`.
- **Sentiment Visual Mapping:**
  - Evaluates emotional valence of retrieved memory chunks.
  - Clamps output parameters within safe visual boundaries:
    - `candleFlameScale`: 0.8 to 1.8
    - `particleDriftSpeed`: 0.005 to 0.04
    - `fogDensity`: 0.015 to 0.06
    - `lightingWarmth`: 0.4 to 1.0

### 5.3 Synthetic Archival Data (`syntheticArchive.ts`)
- 12 synthetic historical records:
  - `mem_001`: Mole Poblano handwritten recipe book (Abuela Elena).
  - `mem_002`: Classical guitar purchase receipt and luthier letter (Tío Héctor).
  - `mem_003`: Silver pocket watch stop-time record (Abuelo Mateo).
  - `mem_004` & `mem_005`: Conflicting accounts of Oaxaca courtyard fountain.
  - `mem_006`: Chicago winter carpentry journal (Mateo, 1974).
  - `mem_007`: Universidad de Guadalajara medical degree (Sofia).
  - `mem_008`: Copper kettle artisan provenance (Santa Clara del Cobre).
  - `mem_009`: Calle Morelos carpentry apprenticeship record (Mateo, 1952).
  - `mem_010`: Letters exchanged between Michoacán and Illinois.
  - `mem_011`: Día de los Muertos altar placement notes.
  - `mem_012`: Severe storm during 1982 cemetery vigil.
- 30 Gold Benchmark Test Cases covering all 6 critical evaluation domains.

---

## 6. Testing, Build, & Configuration Inventory

### 6.1 Automated Test Suite (`tests/`)
- `tests/run-all.js`: Master test runner with formatted terminal output and exit code propagation.
- `tests/rag.test.js`: 8 unit tests validating BM25 retrieval, Spanish accents, regex escaping, chunking, and deletion.
- `tests/grounding.test.js`: 31 tests validating all 30 Gold Benchmark cases and suite integrity.
- `tests/sentiment.test.js`: 4 tests validating sentiment classification and visual boundary clamping.
- `tests/audio.test.js`: 3 tests validating Web Audio initialization, toggle safety, and headless behavior.

### 6.2 Configuration & CI
- `package.json`: Normalized package metadata (`animas-sovereign-ofrenda`), version `0.1.0`, valid dependencies, and cross-platform npm scripts.
- `.github/workflows/ci.yml`: GitHub Actions matrix testing on Ubuntu and Windows across Node.js 20 and 22.
- `.editorconfig`: Cross-IDE formatting standard (2-space indent, UTF-8, LF line endings).
- `.gitattributes`: Git line ending normalization ensuring clean cross-platform checkouts.
- `.gitignore`: Comprehensive exclusion of build artifacts, temporary directories, caches, and environment secrets.
