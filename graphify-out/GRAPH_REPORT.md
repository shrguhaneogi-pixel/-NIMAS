# Graph Report - -NIMAS  (2026-11-01)

## Corpus Check
- 89 files · ~63,957 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 1, .lock 1)

## Summary
- 378 nodes · 878 edges · 17 communities (15 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- RAG & Grounded Companion
- Architectural Blueprint System
- Application Shell & Cursor
- 3D Sanctuary & Dither Shaders
- CI/CD Automation Pipeline
- Procedural 16-Bit Textures
- TypeScript Configuration
- Build & Dev Tooling
- Runtime & AI Dependencies
- Visual Relic Rail & Icons
- Constitutional Prompt Workbench
- Automated Test Suite Runner
- Package Manifest & Metadata
- Vite Bundler Pipeline
- Web Audio Ambience Engine
- NPM Lifecycle Scripts
- Node Runtime Types

## God Nodes (most connected - your core abstractions)
1. `react` - 41 edges
2. `lucide-react` - 33 edges
3. `VisualDirectionState` - 23 edges
4. `MemoryDocument` - 17 edges
5. `compilerOptions` - 16 edges
6. `buildOfrendaTexturesAsync()` - 15 edges
7. `useBlueprintState()` - 15 edges
8. `LocalRAGEngine` - 13 edges
9. `getRelicPixelIcon()` - 12 edges
10. `TopNavbar()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `PromptWorkbenchProps` --references--> `VisualDirectionState`  [EXTRACTED]
  src/components/PromptWorkbench/PromptWorkbench.tsx → src/types/index.ts
- `OfrendaSceneGraph` --references--> `OfrendaItemClickData`  [EXTRACTED]
  src/components/ThreeOfrenda/sceneBuilder.ts → src/types/index.ts
- `CompanionDrawerProps` --references--> `VisualDirectionState`  [EXTRACTED]
  src/components/CompanionDrawer.tsx → src/types/index.ts
- `FloatingDockProps` --references--> `VisualDirectionState`  [EXTRACTED]
  src/components/FloatingDock.tsx → src/types/index.ts
- `InquestDrawerProps` --references--> `VisualDirectionState`  [EXTRACTED]
  src/components/InquestDrawer/InquestDrawer.tsx → src/types/index.ts

## Import Cycles
- None detected.

## Communities (17 total, 2 thin omitted)

### Community 0 - "RAG & Grounded Companion"
Cohesion: 0.07
Nodes (44): CompanionDrawerProps, MessageHistoryItem, FloatingDockProps, InquestDrawerProps, RetrievedRecordCard, MemoryInspectorModal(), MemoryInspectorModalProps, Prompt04SentimentEngineProps (+36 more)

### Community 1 - "Architectural Blueprint System"
Cohesion: 0.11
Nodes (32): lucide-react, react, AgentDelegationSection(), AgentRole, AGENTS, AiRagCategoryCard(), ArchitectureCategoryCard(), CardItemView (+24 more)

### Community 2 - "Application Shell & Cursor"
Cohesion: 0.11
Nodes (29): App(), CursorMode, CursorStateDetail, CustomSanctuaryCursor(), FloatingDock(), InquestDrawer(), AppTabId, TopNavbar() (+21 more)

### Community 3 - "3D Sanctuary & Dither Shaders"
Cohesion: 0.10
Nodes (23): @react-three/drei, @react-three/fiber, three, DitherCursorPipeline, DitherCursorPostProcess(), DitherCursorShader, DitherTrailShader, DitherVertexShader (+15 more)

### Community 4 - "CI/CD Automation Pipeline"
Cohesion: 0.09
Nodes (22): jobs, test-and-build, node-version, os, name, on, pull_request, push (+14 more)

### Community 5 - "Procedural 16-Bit Textures"
Cohesion: 0.28
Nodes (18): applyBayerDither(), BAYER_4X4, buildOfrendaTexturesAsync(), createChevronFloorTexture(), createContactShadowTexture(), createCorbelledStoneTexture(), createFlameGlowSpriteTexture(), createMarigoldPetalTexture() (+10 more)

### Community 6 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 7 - "Build & Dev Tooling"
Cohesion: 0.12
Nodes (17): devDependencies, autoprefixer@^10.4.21, esbuild@^0.25.0, tailwindcss@^4.3.3, @types/express@^4.17.21, @types/react@^19.3.0, @types/react-dom@^19.3.0, @types/three@^0.187.0 (+9 more)

### Community 8 - "Runtime & AI Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, dotenv@^17.2.3, express@^4.21.2, @google/genai@^2.4.0, lucide-react@^0.546.0, motion@^12.23.24, react@^19.0.1, react-dom@^19.0.1 (+8 more)

### Community 9 - "Visual Relic Rail & Icons"
Cohesion: 0.32
Nodes (14): CopalChaliceIcon(), ElenaCameoIcon(), getRelicPixelIcon(), HectorCameoIcon(), MateoCameoIcon(), PanDeMuertoIcon(), ParachoGuitarIcon(), RELIC_ITEMS (+6 more)

### Community 10 - "Constitutional Prompt Workbench"
Cohesion: 0.25
Nodes (10): Prompt00Constitution(), Prompt01Architecture(), Prompt02ArchiveDataset(), Prompt03GroundedAnswerer(), Prompt04SentimentEngine(), Prompt05EvaluationAudit(), Prompt06LocalOptimization(), Prompt07Phase3Export() (+2 more)

### Community 11 - "Automated Test Suite Runner"
Cohesion: 0.17
Nodes (6): __dirname, __filename, testFiles, __dirname, __filename, projectRoot

### Community 12 - "Package Manifest & Metadata"
Cohesion: 0.18
Nodes (10): camera-controls@^3.1.2, description, tsx@^4.21.0, license, name, private, type, version (+2 more)

### Community 13 - "Vite Bundler Pipeline"
Cohesion: 0.25
Nodes (6): @tailwindcss/vite@^4.3.3, vite@^8.3.0, @vitejs/plugin-react@^6.1.1, @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 15 - "NPM Lifecycle Scripts"
Cohesion: 0.29
Nodes (7): scripts, build, clean, dev, lint, preview, test

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Architectural Blueprint System` to `RAG & Grounded Companion`, `Application Shell & Cursor`, `3D Sanctuary & Dither Shaders`, `Runtime & AI Dependencies`, `Visual Relic Rail & Icons`, `Constitutional Prompt Workbench`, `Package Manifest & Metadata`?**
  _High betweenness centrality (0.278) - this node is a cross-community bridge._
- **Should `RAG & Grounded Companion` be split into smaller, more focused modules?**
  _Cohesion score 0.06729356450191008 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Architectural Blueprint System` to `RAG & Grounded Companion`, `Application Shell & Cursor`, `3D Sanctuary & Dither Shaders`, `Runtime & AI Dependencies`, `Visual Relic Rail & Icons`, `Constitutional Prompt Workbench`, `Package Manifest & Metadata`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Should `Architectural Blueprint System` be split into smaller, more focused modules?**
  _Cohesion score 0.10621942697414395 - nodes in this community are weakly interconnected._
- **Should `Application Shell & Cursor` be split into smaller, more focused modules?**
  _Cohesion score 0.10810810810810811 - nodes in this community are weakly interconnected._
- **Should `3D Sanctuary & Dither Shaders` be split into smaller, more focused modules?**
  _Cohesion score 0.0989247311827957 - nodes in this community are weakly interconnected._
- **Should `CI/CD Automation Pipeline` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._