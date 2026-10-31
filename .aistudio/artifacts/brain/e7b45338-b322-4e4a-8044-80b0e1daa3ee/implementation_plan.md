# Ánimas — Visual & Spatial Overhaul: Contemporary Ritual & 3D Architectural Sanctuary

This comprehensive upgrade elevates Ánimas into a flagship memorial experience by uniting ancient ceremonial stone architecture with vibrant Día de los Muertos ofrenda traditions, directly grounded in the provided visual references (`image_923ab21e.png`, `image_f19971f3.png`, and `image_251f0a00.png`), while refactoring the Phase 3 Blueprint into 5 modular, independently metered category sub-components.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following directions have been confirmed and synthesized from your clarifications, reference images, and technical review:

- **Confirmed Decision 1 (Sanctuary Spatial Balance)**: Blended monumental corbelled stone crypt architecture with hanging jewel-toned *papel picado* banners, tiered altar steps, and an illuminated sanctuary portal (synthesizing `image_251f0a00.png` and `image_923ab21e.png`).
- **Confirmed Decision 2 (Botanical Floral Density)**: Dense procedural *cempasúchil* marigold flower banks and buds (modeled after `image_f19971f3.png`) flanking the chevron stone pathway, covering the altar steps, and shedding drifting petal particles.
- **Confirmed Decision 3 (Blueprint Sub-Component Architecture & State)**: Five dedicated category sub-components (`ArchitectureCategoryCard`, `AiRagCategoryCard`, `SecurityCategoryCard`, `Frontend3DCategoryCard`, `ReleaseCategoryCard`) driven by a unified `BlueprintVerificationContext` supporting atomic category toggles, category resets, and instant $X/32$ metric updates.
- **Confirmed Technical Measure 1 (Asynchronous Texture Generation)**: Sliced texture generation yielding execution with `await new Promise(r => setTimeout(r, 0))` between procedural canvas builds to maintain 60fps main-thread responsiveness with an authentic ceremonial loading state.
- **Confirmed Technical Measure 2 (Point Light & Shadow Budget)**: Maximum 1 directional key shadow caster and 1 focused altar point light with shadows; all colonnade pathway candles use emissive `MeshBasicMaterial` with soft billboard luminous glow sprites (`THREE.Sprite`) to protect mobile GPUs.
- **Confirmed Technical Measure 3 (Isolated Raycasting & Forgiving Touch Targets)**: Raycasting strictly isolated to the 7 offering meshes in a dedicated `interactiveGroup`, paired with forgiving 2D overlay tags for effortless touch interaction on mobile.
- **Confirmed Technical Measure 4 (Exhaustive WebGL Disposal Protocol)**: Dedicated resource registry tracking all geometries, PBR materials, and dynamically generated `CanvasTexture` instances with recursive `.dispose()` on canvas unmount.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms the Ánimas 3D Sanctuary from an isolated wooden altar into a grand, atmospheric memorial hall where ancestral memories are kept and honored. Users walk a candlelit ceremonial pathway flanked by lush marigolds and glowing votives under fluttering papel picado banners to interact with sacred offerings.
- **Target Audience**: Families and individuals seeking a private, sovereign, and emotionally profound space to preserve, query, and reflect upon archival memories and family records.
- **Key Value**: Replaces generic 3D demo aesthetics with an authentic cultural synthesis—monumental stone permanence meets intimate, vibrant festival warmth, with 100% local-first performance and zero external asset dependencies.

---

## 2. User Experience & Visual Design

### 2.1 Aesthetic Theme: Contemporary Ritual × Editorial Restraint
- **Color Palette & Materiality**:
  - *Dominant Obsidian & Basalt* (`#07080D`, `#12141F`, `#1C1E2D`): Textured corbelled stone vaults, chevron-tiled floor paving, and deep shadow falloff.
  - *Sacred Marigold & Amber* (`#F59E0B`, `#D97706`, `#FB923C`): Multi-layered cempasúchil flower heads, glowing candle cores, and warm directional key light.
  - *Ceremonial Papel Picado Dyes* (`#9333EA` Royal Purple, `#EC4899` Magenta, `#06B6D4` Sacred Cyan, `#F59E0B` Marigold Gold): Vibrantly tinted banners suspended high across the corbelled arch with intricate laser-cut calavera and botanical motifs.
  - *Ivory & Candle Wax* (`#FEF3C7`, `#FFFBEB`): Organic melting candle pillars with wax drips, grounded in dark cast-iron and stone votive bases.
- **Atmosphere & Lighting**:
  - Symmetrical colonnades of glowing candle flames with soft glowing halo sprites and warm contact grounding.
  - Deep atmospheric horizon fog (`THREE.FogExp2(0x0a0c14, 0.04)`) receding into the sacred portal.
  - Gentle swirling petal drift particle system caught in an ambient nocturnal breeze.

### 2.2 3D Scene Architecture Overhaul (Three.js Procedural Craft)
1. **Corbelled Stone Sanctuary & Chevron Floor** (inspired by `image_251f0a00.png`):
   - Stepped corbelled stone arch hall constructed from procedural beveled stone blocks with procedural granite/slate bump textures.
   - Symmetrical chevron-paved stone floor leading from the camera foreground directly to the altar base.
   - Rear sacred doorway/portal with a warm glowing interior amber aperture.
2. **Hanging Papel Picado Bunting Array** (inspired by `image_923ab21e.png`):
   - Double curved suspension catenary cables spanning the vault.
   - Procedural canvas cutout textures generating genuine Mexican papel picado designs: Calavera Catrina, geometric flowers, and scalloped serrated fringing.
   - Rich jewel-toned translucent double-sided materials with gentle sine-wave wind fluttering.
3. **High-Fidelity Cempasúchil Marigolds & Banks** (inspired by `image_f19971f3.png`):
   - 3-scale composite procedural flower model:
     - Multi-tiered serrated petal rings with radial curling and organic tilt.
     - Dark textured florets and pollen center.
     - Green calyx, stem, and unbloomed flower buds.
   - Lush dense flower banks lining both sides of the chevron floor and cascading down the stepped tiers using `InstancedMesh`.
   - Fallen petal ground carpet scattered along the central stone pathway.
4. **Candlelight Colonnade & Sacred Altar**:
   - Multi-tiered ceremonial altar hosting the gilded nichos, offerings (pan de muerto, copal sahumerio, antique pocket watch, acoustic guitar, Puebla mole pot).
   - Paired rows of graduated pillar candles sitting on circular stone sconces along the pathway.
   - Volumetric rising smoke wisps from the copal sahumerio.

### 2.3 Phase 3 Blueprint 5-Category Sub-Component Refactoring
Split the checklist into clean, dedicated, maintainable domain sub-components under `/src/components/Tabs/Phase3BlueprintTab/categories/`:
1. `ArchitectureCategoryCard.tsx`: 6 criteria covering monorepo topology, process boundaries, lockfile pinning, and canonical schemas.
2. `AiRagCategoryCard.tsx`: 7 criteria covering local Gemma execution, sqlite-vec embeddings, chunking boundaries, and CoT grounding.
3. `SecurityCategoryCard.tsx`: 6 criteria covering loopback binding, zero data egress, prompt injection defense, and cascading purge.
4. `Frontend3DCategoryCard.tsx`: 7 criteria covering 3D memory inspection, procedural assets, WCAG AA touch targets, and WebGL fallbacks.
5. `ReleaseCategoryCard.tsx`: 6 criteria covering unit tests, gold benchmark suites, hardware latency matrix, and air-gapped acceptance.

Each sub-component features:
- Independent circular progress ring / fractional badge (`x / N Verified`).
- Quick "Select All" / "Clear Category" convenience actions.
- Collapsible item detail cards with exact test criteria and verification rationale.
- Unified state management via `BlueprintVerificationContext` connected to `localStorage` (`animas_dod_verification_v1`).

---

## 3. Key Product Decisions & Trade-Offs

- **Asynchronous Sliced Texture Generation**:
  - *Chosen Approach*: Sequential generator yielding control with `setTimeout(0)` between canvas generation steps, with an ambient loading overlay.
  - *Why*: Eliminates frame drops and main-thread freezes when compiling detailed procedural patterns.
- **InstancedMesh Performance for Flowers and Petals**:
  - *Chosen Approach*: `THREE.InstancedMesh` for repeated marigold flower heads and scattered path petals, with per-instance color variation (`setColorAt`) and scale jitter.
  - *Why*: Keeps draw calls low (< 35 draw calls) while rendering hundreds of lush flowers and thousands of petals at smooth 60fps.
- **Point Light Budget & Glowing Sprites**:
  - *Chosen Approach*: Only 1-2 actual point lights (near altar/inspected item); all pathway candles use emissive materials with lightweight billboard sprites.
  - *Why*: Prevents mobile GPU thermal throttling while maintaining stunning visual luminosity.
- **Dedicated Interactive Raycast Group with Touch Overlays**:
  - *Chosen Approach*: Raycaster only checks `interactiveGroup`, accompanied by clean 2D HTML/DOM pill tags hovering above offerings.
  - *Why*: Solves mobile touch mis-taps in dense scenes without affecting 3D rendering.
- **Exhaustive WebGL Disposal Protocol**:
  - *Chosen Approach*: Explicit disposal registry tracking every geometry, material, and `CanvasTexture` created in the scene.
  - *Why*: Guarantees zero memory leaks and prevents GPU context loss during prolonged tab switching.

---

## 4. Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App.tsx (Root Layout)                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────────┐                     ┌───────────────────────────┐
│     TopNavbar.tsx         │                     │   InquestDrawer.tsx       │
│  (5-Tab Quick Switcher)   │                     │  (Mobile Sheet / Desktop) │
└───────────────────────────┘                     └───────────────────────────┘
           │
           ├─► Tab 1: SovereignSanctuaryTab.tsx
           │     ├─► OfrendaCanvas.tsx
           │     │     ├─► sceneBuilder.ts (Corbelled Crypt, Papel Picado, Flower Banks)
           │     │     ├─► proceduralTextures.ts (Async Sliced Texture Generator)
           │     │     ├─► OfferingTouchOverlay.tsx (Forgiving 2D touch targets)
           │     │     └─► audioAmbience.ts (Breeze, Candle Crackle, Bell Chimes)
           │     ├─► FloatingDock.tsx (Camera Presets, Lighting Warmth, Cinema Mode)
           │     └─► MemoryInspectorModal.tsx (Archival Context & Sentiment Sync)
           │
           ├─► Tab 2: ArchiveExplorerTab.tsx
           ├─► Tab 3: AuditStudioTab.tsx
           ├─► Tab 4: ScaffoldExporterTab.tsx
           │
           └─► Tab 5: Phase3BlueprintTab.tsx
                 │   [Wrapped in BlueprintVerificationContext]
                 ├─► ArchitectureCategoryCard.tsx (6 Items + Progress Ring)
                 ├─► AiRagCategoryCard.tsx (7 Items + Progress Ring)
                 ├─► SecurityCategoryCard.tsx (6 Items + Progress Ring)
                 ├─► Frontend3DCategoryCard.tsx (7 Items + Progress Ring)
                 ├─► ReleaseCategoryCard.tsx (6 Items + Progress Ring)
                 ├─► MonorepoArchitectureSection.tsx
                 ├─► DualRuntimeSection.tsx
                 ├─► AgentDelegationSection.tsx
                 └─► ThreatRegisterSection.tsx
```

---

## 5. Step-by-Step Implementation Sequence

1. **Step 1: Asynchronous Procedural Texture Generation (`proceduralTextures.ts`)**:
   - Refactor texture generation functions to run with asynchronous yields (`await new Promise(r => setTimeout(r, 0))`).
   - Add `createCorbelledStoneTexture`: Aged basalt/granite with chisel marks and mortar seams.
   - Add `createChevronFloorTexture`: Deep slate chevron herringbone tile pattern.
   - Add `createPapelPicadoTexture`: 5 jewel-toned color variants with calavera skulls and floral lace cutouts.
   - Add `createMarigoldPetalTexture` & `createFlameGlowSpriteTexture`.

2. **Step 2: 3D Scene Architecture Overhaul & Disposal Registry (`sceneBuilder.ts`)**:
   - Construct monumental Corbelled Stone Sanctuary vault ribs with stepped arch ceiling and rear glowing portal.
   - Build Symmetrical Candle Colonnade: Paired stone votives with luminous sprite halos lining the chevron pathway.
   - Build Papel Picado Bunting Rig: Dual catenary suspension wires with waving banners.
   - Build Procedural Cempasúchil Marigold Banks: Multi-tiered floral geometries, green stems/buds, and lush roadside flower mounds via `InstancedMesh`.
   - Add Scattered Petal Carpet along the chevron floor and altar stairs.
   - Restrict interactive offering objects to a dedicated `interactiveGroup`.
   - Implement `disposeSceneResources(registry)` to clean up all geometries, materials, and canvas textures.

3. **Step 3: WebGL Host, Raycasting & Touch Targets (`OfrendaCanvas.tsx`)**:
   - Implement asynchronous texture preloading with an ambient progress state.
   - Point light throttling: Key directional light + 1 altar point light with shadows, all others unlit/sprite halos.
   - Raycasting restricted to `interactiveGroup`.
   - Floating HTML/DOM touch targets over offerings for mobile touch forgiveness.

4. **Step 4: Blueprint Verification Context & Category Sub-Components**:
   - Create `/src/components/Tabs/Phase3BlueprintTab/BlueprintVerificationContext.tsx` providing atomic updates and `localStorage` syncing.
   - Create 5 category sub-components:
     - `ArchitectureCategoryCard.tsx`
     - `AiRagCategoryCard.tsx`
     - `SecurityCategoryCard.tsx`
     - `Frontend3DCategoryCard.tsx`
     - `ReleaseCategoryCard.tsx`
   - Refactor `Phase3BlueprintTab.tsx` to utilize the Context and render the 5 modular cards.

5. **Step 5: Verification & Quality Assurance**:
   - Execute `lint_applet` (`tsc --noEmit`).
   - Execute `compile_applet` (Vite build).
   - Test interaction across Sanctuary 3D scene, Inquest Drawer, and 5 Blueprint category cards.
