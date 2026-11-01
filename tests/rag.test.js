/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: Automated Unit Tests for Local-First RAG Engine
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { LocalRAGEngine } from '../src/services/ragEngine.ts';

describe('LocalRAGEngine Unit Tests', () => {
  let rag;

  beforeEach(() => {
    rag = new LocalRAGEngine();
  });

  test('loads initial synthetic archive documents', () => {
    const docs = rag.getDocuments();
    assert.ok(docs.length >= 12, 'Archive should contain at least 12 synthetic documents');
    assert.ok(docs.some(d => d.source_id === 'mem_001'), 'Should contain mem_001');
  });

  test('retrieves relevant chunks for direct recipe search', () => {
    const results = rag.retrieve('four dried chilies mole poblano', 3);
    assert.ok(results.length > 0, 'Should find matching chunks');
    assert.strictEqual(results[0].source.source_id, 'mem_001', 'Top result should be mem_001');
    assert.ok(results[0].score > 1.0, 'Relevance score should be significant');
  });

  test('handles Spanish unicode accented characters accurately', () => {
    const results = rag.retrieve('cempasúchil', 3);
    assert.ok(results.length > 0, 'Should match accented cempasúchil');
    const hasMarigoldDoc = results.some(r => r.source.title.includes('Cempasúchil'));
    assert.ok(hasMarigoldDoc, 'Should retrieve document with Cempasúchil in title');
  });

  test('resists special regex characters without throwing syntax errors', () => {
    assert.doesNotThrow(() => {
      rag.retrieve('guitar? (paracho) [1971] +mole *special*', 3);
    }, 'Should not throw SyntaxError on unescaped regex characters');
  });

  test('ingests custom document and chunks content appropriately', () => {
    const doc = rag.ingestDocument({
      title: 'Family Letter 1955',
      filename: 'letter_1955.md',
      content: 'Dear Elena,\n\nWe arrived safely in Oaxaca yesterday.\n\nThe weather is warm and peaceful.',
      source_date: '1955-06-12',
      tags: ['letter', 'oaxaca']
    });

    assert.ok(doc.source_id.startsWith('mem_'), 'Should generate mem_ prefix source_id');
    assert.strictEqual(doc.chunks.length, 3, 'Should generate 3 chunks from paragraphs');
    assert.ok(doc.chunks[0].chunk_id.startsWith('chunk_'), 'Chunks should have chunk_ prefix');

    const retrieved = rag.retrieve('safely in Oaxaca yesterday', 2);
    assert.ok(retrieved.length > 0, 'Should be able to retrieve newly ingested document');
    assert.strictEqual(retrieved[0].source.source_id, doc.source_id);
  });

  test('ingests single-line document without double newlines safely', () => {
    const doc = rag.ingestDocument({
      title: 'Single Line Note',
      filename: 'note.txt',
      content: 'A single sentence archive fragment without paragraphs.'
    });

    assert.strictEqual(doc.chunks.length, 1, 'Should create exactly 1 chunk');
    assert.ok(doc.chunks[0].content.includes('single sentence'));
  });

  test('deletes document cleanly by source_id', () => {
    const doc = rag.ingestDocument({
      title: 'Ephemeral Note',
      filename: 'ephemeral.txt',
      content: 'To be deleted shortly.'
    });

    assert.ok(rag.getDocumentById(doc.source_id), 'Document should exist');
    const deleted = rag.deleteDocument(doc.source_id);
    assert.strictEqual(deleted, true, 'Delete operation should return true');
    assert.strictEqual(rag.getDocumentById(doc.source_id), undefined, 'Document should no longer exist');
  });

  test('resets archive back to synthetic defaults', () => {
    rag.ingestDocument({
      title: 'Temporary',
      filename: 'temp.txt',
      content: 'Temporary content'
    });
    const reset = rag.resetToSyntheticDefault();
    assert.strictEqual(reset.some(d => d.title === 'Temporary'), false, 'Reset should remove custom documents');
  });
});
