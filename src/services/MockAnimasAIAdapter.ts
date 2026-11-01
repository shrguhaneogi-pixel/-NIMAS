/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - MockAnimasAIAdapter
 * Clean abstraction layer simulating the future local FastAPI + SQLite-vec + Gemma 2B/9B backend.
 */

import type {
  GroundedMemoryAnswer,
  SovereignSentimentResponse,
  RetrievalResult,
  MemoryDocument,
  VisualDirectionState
} from '../types/index.ts';
import { localRAG } from './ragEngine.ts';
import { gemmaService } from './gemmaSimulator.ts';
import { getApiBaseUrl } from './apiClient.ts';

export interface QueryMemoriesRequest {
  question: string;
  top_k?: number;
  client_state?: {
    camera_profile?: string;
    active_offering_id?: string | null;
  };
}

export interface QueryMemoriesResponse {
  answer: GroundedMemoryAnswer;
  retrievals: RetrievalResult[];
  visual_direction: SovereignSentimentResponse;
}

export interface IngestDocumentRequest {
  title: string;
  filename: string;
  content: string;
  source_date?: string | null;
  language?: string;
  people_as_written?: string[];
  tags?: string[];
}

export class MockAnimasAIAdapter {
  /**
   * Queries memories using local-first RAG and Gemma CoT generation.
   * If NEXT_PUBLIC_API_URL or VITE_API_URL is configured and reachable,
   * queries the live FastAPI backend; otherwise falls back to local simulation.
   */
  public async queryMemories(req: QueryMemoriesRequest): Promise<QueryMemoriesResponse> {
    const topK = req.top_k || 4;

    const baseUrl = getApiBaseUrl();
    if (baseUrl && typeof fetch === 'function') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`${baseUrl}/api/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data && data.answer && data.visual_direction) {
            // Defensive normalization: guarantee r.chunk and r.source shape
            const normalizedRetrievals = (data.retrievals || []).map((r: any) => {
              if (r.chunk && r.source) return r;
              return {
                chunk: {
                  chunk_id: r.chunk_id || r.chunk?.chunk_id || 'chunk_001',
                  source_id: r.source_id || r.source?.source_id || 'mem_001',
                  chunk_index: r.chunk_index ?? 0,
                  content: r.content || r.chunk?.content || '',
                  token_estimate: r.token_estimate ?? 50,
                },
                source: {
                  source_id: r.source_id || r.source?.source_id || 'mem_001',
                  title: r.title || r.source?.title || 'Archivo Familiar',
                  original_filename: r.original_filename || r.source?.original_filename || '',
                  source_date: r.source_date || r.source?.source_date || null,
                  language: r.language || 'es-MX',
                  heading: r.heading || '',
                  source_type: 'archival_record',
                  people_as_written: r.people_as_written || [],
                  tags: r.tags || [],
                  content: r.source?.content || r.content || '',
                  chunks: [],
                },
                score: r.score ?? 1.0,
                matched_terms: r.matched_terms || [],
              };
            });
            return {
              ...data,
              retrievals: normalizedRetrievals
            };
          }
        }
      } catch {
        // Fall back gracefully to in-browser RAG simulation
      }
    }

    // 1. Local-first Vector / Term Search via SQLite-vec simulation
    const retrievals = localRAG.retrieve(req.question, topK);

    // 2. Grounded Memory Answerer (CoT + Strict JSON)
    const answer = await gemmaService.generateGroundedAnswer(req.question, retrievals);

    // 3. Sovereign Sentiment Engine (evaluates retrieved memory text)
    const visual_direction = gemmaService.analyzeSentiment(
      retrievals.length > 0 ? retrievals[0].source : req.question
    );

    return {
      answer,
      retrievals,
      visual_direction
    };
  }

  /**
   * Ingests a new text/markdown document into the local archive.
   * Syncs with FastAPI backend if configured, otherwise persists locally.
   */
  public async ingestMemory(req: IngestDocumentRequest): Promise<MemoryDocument> {
    const baseUrl = getApiBaseUrl();
    if (baseUrl && typeof fetch === 'function') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`${baseUrl}/api/memories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const serverDoc = await res.json();
          localRAG.ingestDocument({
            title: req.title,
            filename: req.filename,
            content: req.content,
            source_date: req.source_date,
            language: req.language || 'es-MX',
            people_as_written: req.people_as_written,
            tags: req.tags
          });
          return serverDoc;
        }
      } catch {
        // Fall back to local simulation
      }
    }

    // Simulate brief asynchronous processing delay for chunking
    await new Promise(r => setTimeout(r, 120));
    return localRAG.ingestDocument({
      title: req.title,
      filename: req.filename,
      content: req.content,
      source_date: req.source_date,
      language: req.language || 'es-MX',
      people_as_written: req.people_as_written,
      tags: req.tags
    });
  }

  /**
   * Evaluates memory sentiment and derives 3D presentation state
   */
  public evaluateSentiment(docOrText: MemoryDocument | string): SovereignSentimentResponse {
    return gemmaService.analyzeSentiment(docOrText);
  }

  /**
   * Converts sentiment JSON tokens into bounded 3D visual parameters
   */
  public mapToVisualParameters(sentiment: SovereignSentimentResponse): Partial<VisualDirectionState> {
    return {
      memory_tone: sentiment.memory_tone,
      tone_confidence: Math.max(0, Math.min(1, sentiment.tone_confidence)),
      visual_intensity: Math.max(0, Math.min(1, sentiment.visual_intensity)),
      lighting_profile: sentiment.lighting_profile,
      particle_profile: sentiment.particle_profile,
      camera_profile: sentiment.camera_motion === 'slow_drift' ? 'slow_drift' : 'static',
      motion_profile: sentiment.memory_tone === 'joyful' ? 'lively' : sentiment.memory_tone === 'somber' ? 'still' : 'gentle'
    };
  }
}

export const animasAI = new MockAnimasAIAdapter();
