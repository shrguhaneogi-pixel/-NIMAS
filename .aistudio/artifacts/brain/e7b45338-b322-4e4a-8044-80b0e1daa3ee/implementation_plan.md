# Implementation Plan: Reactive Ceremonial Candle Cursor & Thermal Heat-Haze GLSL Shimmer

Upgrade `CustomSanctuaryCursor.tsx` and WebGL integration in `OfrendaCanvas.tsx` with a dual-state ceremonial torch cursor that transforms into an authentic thermal heat-mirage glow with scrolling UV displacement when holding the mouse button or dragging the camera.

---

## 1. Procedural Noise & Gradient Ramp Generation (`proceduralTextures.ts`)
- **Seamless 128x128 Noise & Normal Map Generator (`createNoiseNormalMap`):**
  - Synthesize a tileable dual-frequency vector displacement field on an offscreen HTML5 Canvas.
  - Channel mapping:
    - Red (`R`): Horizontal derivative / tangent flow $(\partial N / \partial x)$
    - Green (`G`): Vertical convective flow $(\partial N / \partial y)$
    - Blue (`B`): Multi-scale turbulence density mask for heat intensity
  - Set `texture.wrapS = THREE.RepeatWrapping`, `texture.wrapT = THREE.RepeatWrapping`, `texture.minFilter = THREE.LinearFilter`, `texture.magFilter = THREE.LinearFilter`.
- **Solar Golden Thermal Gradient Ramp (`createThermalGradientRamp`):**
  - 256×1 lookup ramp following the confirmed solar palette:
    - `0.00`: Obsidian void / transparent (`#07080d00`)
    - `0.20`: Terracotta ember shadow (`#4a1525`)
    - `0.45`: Ceremonial saffron orange (`#ea580c`)
    - `0.70`: Luminous Cempasúchil gold (`#f59e0b`)
    - `0.88`: Candle wax amber (`#fde68a`)
    - `1.00`: Incandescent white-hot solar core (`#fffbeb`)

---

## 2. GLSL Heat-Distortion Shader Quad in 3D Scene (`OfrendaCanvas.tsx`)
- **Camera-Facing Heat Shimmer Billboard:**
  - Create a lightweight `THREE.PlaneGeometry(1.6, 1.6)` quad attached to the cursor's 3D intersection position on the altar proxy plane.
  - Orient towards the camera in `useFrame`: `mesh.quaternion.copy(state.camera.quaternion)`.
- **Custom `THREE.ShaderMaterial`:**
  - Uniforms:
    - `uTime`: monotonic clock for convective scrolling
    - `uPressIntensity`: damped float (`0.0` idle $\rightarrow$ `1.0` pressed)
    - `uNoiseNormalMap`: scrolling noise texture
    - `uGradientRamp`: solar thermal palette ramp
  - **Vertex Shader:**
    - Standard camera projection passing UV coordinates and normal.
  - **Fragment Shader:**
    - Dual scrolling UV offsets simulating rising convection currents:
      - `scrollUv1 = vUv * 2.0 + vec2(sin(uTime * 1.7) * 0.12, -uTime * 1.4)`
      - `scrollUv2 = vUv * 3.5 + vec2(-cos(uTime * 2.1) * 0.08, -uTime * 2.2)`
    - Sample normal vectors, calculate radial falloff mask (`smoothstep(0.5, 0.05, dist)`).
    - Displace UVs by `mix(0.03, 0.16, uPressIntensity) * radialMask`.
    - Sample gradient ramp and compute high-frequency micro-shimmer rings (`sin(warpedDist * 28.0 - uTime * 10.0)`).
    - Blending: `THREE.AdditiveBlending`, `depthWrite: false`, `transparent: true`.

---

## 3. 3D Scene Lighting & Petal Updraft Coupling (`OfrendaCanvas.tsx`)
- **Cursor PointLight Synchronizer:**
  - On pointer hold/drag:
    - Smoothly lerp color from `0xff9d3b` to solar white-hot `0xfde68a`.
    - Lerp intensity from `0.8` to `2.2`, distance from `4.0` to `7.5`.
    - Apply high-frequency micro-flicker: `Math.sin(time * 24.0) * 0.15`.
- **Gentle Thermal Petal Updraft:**
  - In `useFrame`, when `uPressIntensity > 0.15`, calculate distance from cursor 3D position to each instanced petal.
  - Within a radius of `2.2` units, apply a gentle upward buoyancy boost:
    `velocities[i * 3 + 1] += clockDelta * 0.65 * (1.0 - dist / 2.2) * uPressIntensity`.
  - Add subtle horizontal outward thermal expansion away from the flame center.

---

## 4. Dual-State Ceremonial Torch Cursor (`CustomSanctuaryCursor.tsx`)
- **State A — Ceremonial Torch & Taper Candle (Idle):**
  - Render stylized taper candle/matchstick-torch body angled at `-25deg` with origin pivot so the flame wick tip sits precisely at `(clientX, clientY)`.
  - Flame tip with 3 concentric layers: `#FFFBEB` core, `#F59E0B` body, `#EA580C` outer halo.
  - Dynamic flame tilt based on horizontal cursor velocity: `tilt = -clamp(vx * 0.4, -28, 28)`.
  - Trail of rising pixel embers drifting upward with quadratic fade.
- **State B — Thermal Heat-Mirage Orb (Pressed):**
  - On `pointerdown` (or camera orbit drag), morph candle body opacity to 0 and expand radiant thermal core (radius `72px`).
  - Inline SVG `<filter id="animas-heat-shimmer">` with `<feTurbulence>` and `<feDisplacementMap>` animated via `requestAnimationFrame` to shimmer DOM elements beneath.
- **Zero-Lag Architecture:**
  - All tracking, velocity calculation, ember pooling, and SVG turbulence updates run inside a single `requestAnimationFrame` loop using mutable refs.
  - Touchscreen media query `@media (hover: none) and (pointer: coarse)` disables persistent cursor and triggers touch-hold thermal bursts.

---

## 5. Verification Plan
1. **Compilation & Linting:** Verify `tsc --noEmit` and Vite production build with zero warnings or errors.
2. **Cursor Hotspot Accuracy:** Verify click events register exactly at the wick tip.
3. **Shader Performance:** Ensure 60 FPS locked in WebGL canvas during active press and orbit dragging.
4. **Visual Verification:** Confirm seamless transition from ceremonial candle into thermal shimmer mirage with gentle petal updraft.
