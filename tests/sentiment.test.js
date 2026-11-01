/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: Automated Unit Tests for Sovereign Sentiment Engine & 3D Visual Parameters
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { GemmaService } from '../src/services/gemmaSimulator.ts';
import { MockAnimasAIAdapter } from '../src/services/MockAnimasAIAdapter.ts';

describe('Sovereign Sentiment & Visual Parameter Mapping Tests', () => {
  const gemma = new GemmaService();
  const adapter = new MockAnimasAIAdapter();

  test('classifies celebratory memory as joyful', () => {
    const text = 'Elena prepared the festival recipe with cheerful music and laughter, dancing the huapango with pride.';
    const res = gemma.analyzeSentiment(text);
    assert.strictEqual(res.memory_tone, 'joyful');
    assert.ok(res.tone_confidence >= 0.8, 'Confidence should be high');
    assert.strictEqual(res.lighting_profile, 'warm_candle');
    assert.strictEqual(res.particle_profile, 'petal_drift');
  });

  test('classifies grave hardship memory as somber', () => {
    const text = 'The mournful telegram arrived in cold winter, recalling the tragic loss and grief at the cemetery grave.';
    const res = gemma.analyzeSentiment(text);
    assert.strictEqual(res.memory_tone, 'somber');
    assert.strictEqual(res.lighting_profile, 'subdued_amber');
    assert.strictEqual(res.particle_profile, 'dust_motes');
    assert.strictEqual(res.camera_motion, 'static');
  });

  test('classifies nostalgic rain vigil as mixed', () => {
    const text = 'Torrential rain and downpour soaked the cemetery, yet laughter and warm atole shared under tepees brought tears of joy.';
    const res = gemma.analyzeSentiment(text);
    assert.strictEqual(res.memory_tone, 'mixed');
    assert.strictEqual(res.lighting_profile, 'balanced_warm');
  });

  test('enforces strict boundary clamping on visual parameters', () => {
    const rawSentiment = {
      reasoning_scratchpad: 'Boundary stress test',
      memory_tone: 'joyful',
      tone_confidence: 1.45, // Out of bounds high
      visual_intensity: -0.25, // Out of bounds low
      lighting_profile: 'warm_candle',
      particle_profile: 'petal_drift',
      camera_motion: 'slow_drift'
    };

    const visual = adapter.mapToVisualParameters(rawSentiment);
    assert.strictEqual(visual.tone_confidence, 1.0, 'Must clamp high confidence to 1.0');
    assert.strictEqual(visual.visual_intensity, 0.0, 'Must clamp low intensity to 0.0');
    assert.strictEqual(visual.motion_profile, 'lively', 'Joyful tone maps to lively motion');
  });
});
