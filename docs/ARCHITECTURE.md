# ÁNIMAS — Architectural Specification

**System Name:** Ánimas: The Sovereign 3D Ofrenda  
**Document Version:** 1.0.0  
**License:** Apache-2.0  

---

## 1. System Vision & Architecture Principles

Ánimas is an interactive, privacy-first memorial environment designed to ground remembrance in historical archives rather than generative fantasy. Its technical architecture balances three core imperatives:

1. **Absolute Data Sovereignty**: All memory documents, letters, audio transcripts, and personal artifacts are processed and stored locally on the user's hardware.
2. **Constitutional Grounding & Anti-Hallucination**: The conversational companion acts strictly as an archival librarian—never as an avatar or simulated consciousness of deceased relatives. It preserves contradictions and abstains when evidence is missing.
3. **Diegetic 3D Spatial Presentation**: Rather than a sterile chat UI, the primary interface is a 3D ofrenda that visually responds to the emotional tone of retrieved memories.

---

## 2. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│  ┌───────────────────────────┐      ┌───────────────────────────────┐  │
│  │   React Three Fiber 3D    │      │      2D Archival UI Layer     │  │
│  │  - Stepped 3-Tier Altar   │◄─────┤  - Inquest Conversational     │  │
│  │  - Procedural 16-Bit PBR  │      │    Drawer (Slide-out)         │  │
│  │  - GLSL Heat-Haze Shader  │      │  - Archive Explorer & Chunks  │  │
│  │  - 80 Drifting Petals     │      │  - Audit Studio (30 Gold TCs) │  │
│  └───────────────────────────┘      └───────────────────────────────┘  │
└────────────────────────────────▲───────────────────────────────────────┘
                                 │
                   Sovereign Sentiment Feedback
                 (Lighting, Particles, Camera Motion)
                                 │
┌────────────────────────────────┴───────────────────────────────────────┐
│                      SERVICE & INTEGRATION LAYER                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                       MockAnimasAIAdapter                        │  │
│  │    - Orchestrates Retrieval, Answering, and Sentiment Mapping    │  │
│  └───────────────────▲──────────────────────────────▲───────────────┘  │
│                      │                              │                  │
│       ┌──────────────┴───────────────┐  ┌───────────┴───────────────┐  │
│       │      LocalRAGEngine          │  │       GemmaService        │  │
│       │  - Unicode-Aware Tokenizer   │  │  - Chain-of-Thought (CoT) │  │
│       │  - BM25 Scoring & Phrasing   │  │  - Strict JSON Output     │  │
│       │  - Paragraph-Level Chunking  │  │  - Abstention on Missing  │  │
│       │  - In-Browser Persistence    │  │  - Contradiction Guard    │  │
│       └──────────────┬───────────────┘  └───────────────────────────┘  │
└──────────────────────┼─────────────────────────────────────────────────┘
                       │
┌──────────────────────▼─────────────────────────────────────────────────┐
│                          PERSISTENCE LAYER                             │
│  - Current: In-Memory / Browser LocalStorage (Safe Quota Fallback)     │
│  - Phase 3 Target: Local SQLite + sqlite-vec on disk via FastAPI       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

### 3.1 3D Ofrenda Engine (`src/components/ThreeOfrenda/`)
- **`OfrendaCanvas.tsx`**: R3F canvas container with a locked retro pixel ratio (`dpr={0.32}`) paired with `image-rendering: pixelated` CSS upscaling. Features an angled altar proxy plane for 3D cursor light projection, Drei `CameraControls` tweening, and WebGL resource cleanup on unmount.
- **`sceneBuilder.ts`**: Procedural low-poly geometry builder (6–8 segments per mesh) generating the altar structure, candles with flickering point lights, copal sahumerio smoke particle systems, and 80 instanced cempasúchil petals.
- **`proceduralTextures.ts`**: Offscreen canvas 16-bit texture generator utilizing a 4x4 Ordered Bayer Matrix dithering algorithm across a curated 16-color Día de los Muertos ceremonial palette.
- **`InteractiveRelic.tsx`**: Diegetic 3D relic wrapper providing forgiving 1.5x hit-proxies, camera drag suppression (`e.delta > 2`), targeted `<Html>` occlusion, and 60 FPS PBR emissive amber shader glow on hover/focus.

### 3.2 Retrieval-Augmented Generation (RAG) Engine (`src/services/ragEngine.ts`)
- **Tokenization**: Uses unicode-aware character classification (`[^\p{L}\p{N}\s]`) to preserve accented Spanish vowels (`á, é, í, ó, ú, ü, ñ`) while removing punctuation and stop words.
- **Scoring**: Computes BM25-inspired term frequency with Inverse Document Frequency (IDF) weights, metadata boosting (title: 1.8x, people: 2.2x, tags: 1.2x), and exact phrase matching bonus (8.0x).
- **Chunking**: Header- and paragraph-boundary aware chunker ensuring chunks remain within sensible token estimates (50–120 tokens).

### 3.3 Gemma Grounded Memory Companion (`src/services/gemmaSimulator.ts`)
Adheres to strict constitutional directives:
1. **Archive-Only Truth**: Zero external training knowledge is permitted to supplement unrecorded details.
2. **Preserve Contradictions**: When sources disagree (e.g. `mem_004` blue ceramic vs `mem_005` carved cantera stone), both accounts are objectively reported with `status: 'conflicting_evidence'`.
3. **Anti-Impersonation**: Rejects requests to adopt personas or speak as deceased relatives (`status: 'out_of_scope'`).
4. **Structured JSON Output**: All responses adhere to `GroundedMemoryAnswer`:
   ```typescript
   export interface GroundedMemoryAnswer {
     schema_version: '1.0';
     reasoning_scratchpad: string;
     status: 'answered' | 'insufficient_evidence' | 'conflicting_evidence' | 'out_of_scope';
     answer: string;
     evidence_used: string[];
     evidence_details?: GroundedEvidence[];
     uncertainty?: { level: 'low' | 'medium' | 'high'; reason: string };
   }
   ```

### 3.4 Sovereign Sentiment Visual Engine
Analyzes emotional qualities of retrieved memory text across five tonal profiles:
- **`joyful`**: Celebrations, music, recipes -> Warm candlelight, drifting petals, lively motion.
- **`somber`**: Loss, grief, hardship, cold -> Subdued amber light, quiet dust motes, static camera.
- **`reflective`**: Ancestral crafts, heirloom tools -> Soft candlelight, gentle drift.
- **`mixed`**: Contrast (rain + laughter) -> Balanced warm lighting, motes.
- **`neutral`**: Ledgers, dates, inventories -> Neutral lighting rig.

---

## 4. Security & Privacy Architecture

- **No Remote Calls**: The client application issues zero outbound HTTP requests for inference or data processing.
- **Input Boundaries**: Ingested document text is treated as untrusted input. Embedded override attempts (`SYSTEM OVERRIDE`, `ATTENTION ASSISTANT`) are intercepted and neutralized.
- **Local Service Scaffolding**: Phase 3 backend scaffolding enforces `127.0.0.1` binding to prevent exposing personal archives on local area networks.
