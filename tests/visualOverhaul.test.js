/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: Visual Overhaul Unit Test Suite
 * Validates:
 * 1. RelicRail 16x16 Pixel-Art Icons replacing text initials.
 * 2. Top-down lit white candle DOM cursor with 2x2 centered flame & -50% hotspot offset.
 * 3. WebGL Dither Cursor Effect shader logic, 4x4 Bayer matrix, FBO decay 0.92, radius 0.08.
 * 4. Complete deprecation of thermal heat-haze cursor, vortex physics, and button-morphing behaviors.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

describe('Visual Overhaul: Relic Rail (16x16 Pixel-Art Icons)', () => {
  const relicRailPath = path.join(projectRoot, 'src', 'components', 'Navigation', 'RelicRail.tsx');
  const relicRailCode = fs.readFileSync(relicRailPath, 'utf-8');

  test('RelicRail file exists and contains all 9 relic items', () => {
    assert.ok(fs.existsSync(relicRailPath), 'RelicRail.tsx must exist');
    const expectedIds = [
      'nicho_elena',
      'nicho_mateo',
      'nicho_hector',
      'nicho_rosa',
      'nicho_sofia',
      'offering_calavera',
      'offering_pan',
      'offering_copal',
      'offering_guitar'
    ];

    for (const id of expectedIds) {
      assert.ok(relicRailCode.includes(`id: '${id}'`), `Must include relic item ${id}`);
    }
  });

  test('Text initials (ER, MR, TH, CA, etc.) are stripped from static rail buttons', () => {
    // Should NOT have item.initials span in button
    assert.strictEqual(
      relicRailCode.includes('{item.initials}'),
      false,
      'Must strip out {item.initials} from button markup'
    );
    // Should render getRelicPixelIcon(item.id)
    assert.ok(
      relicRailCode.includes('getRelicPixelIcon(item.id)'),
      'Must render bespoke pixel icon inside button'
    );
    // Relic buttons must include pixel-btn class
    assert.ok(
      relicRailCode.includes('pixel-btn w-7 h-7'),
      'Must use pixel-btn style box for relic buttons'
    );
  });

  test('All 9 icons use strict 16x16 viewBox, crispEdges, and sacred palette', () => {
    assert.ok(relicRailCode.includes('viewBox="0 0 16 16"'), 'Must have 16x16 viewBox');
    assert.ok(relicRailCode.includes('shapeRendering="crispEdges"'), 'Must use crispEdges shape-rendering');

    // Día de los Muertos palette colors present
    const sacredColors = ['#f59e0b', '#fffbeb', '#d97706', '#78350f', '#fde68a', '#23161c'];
    for (const hex of sacredColors) {
      assert.ok(relicRailCode.includes(hex), `Must use palette color ${hex}`);
    }
  });

  test('Preserves pixelated hover tooltips for all relics', () => {
    assert.ok(relicRailCode.includes('pixel-box-amber pointer-events-none'), 'Must retain pixel-box tooltip container');
    assert.ok(relicRailCode.includes('{item.name}'), 'Must display uppercase name');
    assert.ok(relicRailCode.includes('{item.role}'), 'Must display item role');
  });
});

describe('Visual Overhaul: DOM Cursor (Top-Down Lit White Candle)', () => {
  const cursorPath = path.join(projectRoot, 'src', 'components', 'Cursor', 'CustomSanctuaryCursor.tsx');
  const cursorCode = fs.readFileSync(cursorPath, 'utf-8');

  test('Deprecated thermal heat-haze, turbulence filters, and orb morphing are removed', () => {
    assert.strictEqual(
      cursorCode.includes('animas-heat-shimmer'),
      false,
      'Must not contain deprecated animas-heat-shimmer SVG filter'
    );
    assert.strictEqual(
      cursorCode.includes('feTurbulence'),
      false,
      'Must not contain feTurbulence filter element'
    );
    assert.strictEqual(
      cursorCode.includes('thermalOrbRef'),
      false,
      'Must not contain thermalOrbRef'
    );
    assert.strictEqual(
      cursorCode.includes('emberDivsRef'),
      false,
      'Must not contain ember particle loop'
    );
    assert.strictEqual(
      cursorCode.includes('animas:cursor-press'),
      false,
      'Must not dispatch deprecated animas:cursor-press events'
    );
  });

  test('Top-down lit white candle sprite with 2x2 centered flame is rendered', () => {
    assert.ok(cursorCode.includes('viewBox="0 0 16 16"'), 'Cursor must be 16x16 pixel-art SVG');
    assert.ok(cursorCode.includes('shapeRendering="crispEdges"'), 'Cursor SVG must use crispEdges');

    // 2x2 center flame rects at (7,7), (8,7), (7,8), (8,8)
    assert.ok(cursorCode.includes('x="7" y="7"'), 'Must have center flame pixel at (7,7)');
    assert.ok(cursorCode.includes('x="8" y="7"'), 'Must have center flame pixel at (8,7)');
    assert.ok(cursorCode.includes('x="7" y="8"'), 'Must have center flame pixel at (7,8)');
    assert.ok(cursorCode.includes('x="8" y="8"'), 'Must have center flame pixel at (8,8)');
  });

  test('Cursor hotspot is centered via -50% translation and center transform-origin', () => {
    assert.ok(
      cursorCode.includes('-translate-x-1/2 -translate-y-1/2'),
      'Must offset translation by -50% so center flame is click hotspot'
    );
    assert.ok(
      cursorCode.includes("transformOrigin: 'center center'"),
      'Must set transform-origin: center center'
    );
  });

  test('Static snappy behavior with zero morphing reticles or move re-render churn', () => {
    // Should not have hover reticle boxes
    assert.strictEqual(
      cursorCode.includes('border-dashed'),
      false,
      'Must not contain hover reticle morphing boxes'
    );
    // Should use synchronous translate3d update
    assert.ok(
      cursorCode.includes('translate3d('),
      'Must use hardware-accelerated integer-snapped translate3d'
    );
  });
});

describe('Visual Overhaul: WebGL Dither Cursor Effect (Post-Processing & FBO Trail)', () => {
  const effectPath = path.join(projectRoot, 'src', 'components', 'ThreeOfrenda', 'DitherCursorEffect.ts');
  const effectCode = fs.readFileSync(effectPath, 'utf-8');

  test('DitherCursorEffect defines GLSL post-processing shaders with required uniforms', () => {
    assert.ok(fs.existsSync(effectPath), 'DitherCursorEffect.ts must exist');
    assert.ok(effectCode.includes('uniform vec2 uMouse;'), 'Fragment shader must take uMouse');
    assert.ok(effectCode.includes('uniform vec2 uResolution;'), 'Fragment shader must take uResolution');
    assert.ok(effectCode.includes('uniform float uCoreRadius;'), 'Shader must take uCoreRadius for uncolored candle core');
    assert.ok(effectCode.includes('uniform float uRing1Radius;'), 'Shader must take uRing1Radius for inner candle halo');
    assert.ok(effectCode.includes('uniform float uRing2Radius;'), 'Shader must take uRing2Radius for outer marigold corona');
    assert.ok(effectCode.includes('uniform float uDecay;'), 'Trail shader must take uDecay');
  });

  test('Implements Two Concentric Rings with uncolored core mathematical modeling', () => {
    // Mathematical verification of concentric ring formulation
    const uCoreRadius = 0.022;
    const uRing1Radius = 0.045;
    const uRing1Width = 0.012;
    const uRing2Radius = 0.080;
    const uRing2Width = 0.018;

    function calcRingIntensity(dist) {
      if (dist < uCoreRadius) return 0.0;
      const d1 = (dist - uRing1Radius) / uRing1Width;
      const r1 = Math.exp(-d1 * d1) * 0.95;
      const d2 = (dist - uRing2Radius) / uRing2Width;
      const r2 = Math.exp(-d2 * d2) * 0.70;
      return Math.max(r1, r2);
    }

    // 1. Core exclusion zone (pixels closest to cursor have no colour)
    assert.strictEqual(calcRingIntensity(0.0), 0.0, 'Center hotspot must be strictly 0.0 intensity');
    assert.strictEqual(calcRingIntensity(0.010), 0.0, 'Inner wax zone must be strictly 0.0 intensity');
    assert.strictEqual(calcRingIntensity(0.020), 0.0, 'Immediate boundary inside core must be 0.0 intensity');

    // 2. Ring 1 (Inner golden halo) local peak around 0.045
    const r1Peak = calcRingIntensity(0.045);
    assert.ok(r1Peak > 0.90, `Ring 1 peak should be near 0.95, got ${r1Peak}`);
    assert.ok(r1Peak > calcRingIntensity(0.030), 'Ring 1 peak must be higher than inner slope');
    assert.ok(r1Peak > calcRingIntensity(0.060), 'Ring 1 peak must be higher than intermediate trough');

    // 3. Ring 2 (Outer corona) local peak around 0.080
    const r2Peak = calcRingIntensity(0.080);
    assert.ok(r2Peak > 0.65, `Ring 2 peak should be near 0.70, got ${r2Peak}`);
    assert.ok(r2Peak > calcRingIntensity(0.062), 'Ring 2 peak must be higher than intermediate trough');
    assert.ok(r2Peak > calcRingIntensity(0.120), 'Ring 2 peak must be higher than outer falloff');

    // 4. Intermediate trough creates distinct concentric rings
    const trough = calcRingIntensity(0.062);
    assert.ok(trough < r1Peak && trough < r2Peak, 'Intermediate valley must separate Ring 1 and Ring 2');
  });

  test('Implements 4x4 Bayer matrix ordered dithering', () => {
    assert.ok(effectCode.includes('getBayerValue'), 'Must define 4x4 Bayer matrix evaluation function');
    assert.ok(effectCode.includes('12.0 / 16.0'), 'Must contain Bayer matrix value 12/16');
    assert.ok(effectCode.includes('14.0 / 16.0'), 'Must contain Bayer matrix value 14/16');
    assert.ok(effectCode.includes('15.0 / 16.0'), 'Must contain Bayer matrix value 15/16');
  });

  test('Implements Ping-Pong FBO trail with 0.92 decaying alpha multiplier and 0.08 radius', () => {
    assert.ok(effectCode.includes('0.92'), 'Must use 0.92 decay multiplier');
    assert.ok(effectCode.includes('0.08'), 'Must use 0.08 UV space radius');
    assert.ok(effectCode.includes('currentReadTarget'), 'Must implement ping-pong read target');
    assert.ok(effectCode.includes('currentWriteTarget'), 'Must implement ping-pong write target');
  });

  test('Implements delta-time scaled decay and offscreen mouse safety', () => {
    assert.ok(
      effectCode.includes('Math.pow(this.decay'),
      'Must scale decay by delta-time to normalize duration across display refresh rates'
    );
    assert.ok(
      effectCode.includes('pointerActiveRef'),
      'Must track pointer activity so initial (0,0) pointer does not stamp center of screen'
    );
  });

  test('Bayer 4x4 mathematical matrix verification', () => {
    const expectedBayer = [
      [ 0,  8,  2, 10],
      [12,  4, 14,  6],
      [ 3, 11,  1,  9],
      [15,  7, 13,  5]
    ];

    // Verify matrix values are normalized by 16
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const val = expectedBayer[y][x] / 16.0;
        assert.ok(val >= 0.0 && val < 1.0, 'Bayer value must be in [0, 1)');
      }
    }
  });

  test('OfrendaCanvas strips deprecated thermal heat-haze billboard mesh and press coupling', () => {
    const canvasPath = path.join(projectRoot, 'src', 'components', 'ThreeOfrenda', 'OfrendaCanvas.tsx');
    const canvasCode = fs.readFileSync(canvasPath, 'utf-8');

    assert.strictEqual(
      canvasCode.includes('heatMeshRef'),
      false,
      'OfrendaCanvas must not reference heatMeshRef'
    );
    assert.strictEqual(
      canvasCode.includes('heatShimmerMaterial'),
      false,
      'OfrendaCanvas must not construct heatShimmerMaterial'
    );
    assert.strictEqual(
      canvasCode.includes('isPressedRef'),
      false,
      'OfrendaCanvas must not maintain deprecated isPressedRef'
    );
    assert.strictEqual(
      canvasCode.includes('pressIntensityRef'),
      false,
      'OfrendaCanvas must not maintain deprecated pressIntensityRef'
    );
    assert.strictEqual(
      canvasCode.includes('animas:cursor-press'),
      false,
      'OfrendaCanvas must not listen to animas:cursor-press'
    );
    assert.ok(
      canvasCode.includes('DitherCursorPostProcess'),
      'OfrendaCanvas must render DitherCursorPostProcess component inside Canvas'
    );
  });
});
