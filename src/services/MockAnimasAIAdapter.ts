/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - MockAnimasAIAdapter
 * Clean abstraction layer simulating the future local FastAPI + SQLite-vec + Gemma 2B/9B backend.
 */

import {
  GroundedMemoryAnswer,
  SovereignSentimentResponse,
  RetrievalResult,
  MemoryDocument,
  VisualDirectionState
} from '../types';
import { localRAG } from './ragEngine';
import { gemmaService } from './gemmaSimulator';

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
   * Queries memories using local-first RAG and Gemma CoT generation
   */
  public async queryMemories(req: QueryMemoriesRequest): Promise<QueryMemoriesResponse> {
    const topK = req.top_k || 4;
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
   * Ingests a new text/markdown document into the local archive
   */
  public async ingestMemory(req: IngestDocumentRequest): Promise<MemoryDocument> {
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
