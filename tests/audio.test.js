/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: Automated Unit Tests for Web Audio Ambience Engine
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { audioAmbience } from '../src/services/audioAmbience.ts';

describe('AudioAmbienceEngine Tests', () => {
  test('initial state is idle (not playing)', () => {
    assert.strictEqual(audioAmbience.getIsPlaying(), false);
  });

  test('does not throw or crash in headless environment without window.AudioContext', () => {
    assert.doesNotThrow(() => {
      audioAmbience.init();
      audioAmbience.start();
      audioAmbience.stop();
      audioAmbience.playMemoryChime();
    });
  });

  test('toggle remains safe and predictable', () => {
    // In headless Node, start() safely returns without window.AudioContext
    const active = audioAmbience.toggle();
    assert.strictEqual(typeof active, 'boolean');
    audioAmbience.stop();
    assert.strictEqual(audioAmbience.getIsPlaying(), false);
  });
});
