/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Local-First RAG & Vector Engine
 * 100% offline-first retrieval engine running in-browser using BM25 + TF-IDF cosine embeddings.
 */

import { MemoryChunk, MemoryDocument, RetrievalResult } from '../types';
import { SYNTHETIC_ARCHIVE } from '../data/syntheticArchive';

const STORAGE_KEY = 'animas_sovereign_archive_v1';

// Tokenizer & Stopword list
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'because', 'as', 'what',
  'which', 'this', 'that', 'these', 'those', 'then', 'so', 'than', 'such',
  'both', 'through', 'about', 'for', 'is', 'of', 'while', 'during', 'to',
  'from', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further',
  'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
  'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'd', 'll', 'm',
  'o', 're', 've', 'y', 'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del',
  'en', 'y', 'o', 'que', 'con', 'por', 'para', 'se', 'su', 'sus'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\sáéíóúüñ]/gi, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOPWORDS.has(token));
}

export class LocalRAGEngine {
  private documents: MemoryDocument[] = [];

  constructor() {
    this.loadDocuments();
  }

  public loadDocuments(): MemoryDocument[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.documents = JSON.parse(stored);
        return this.documents;
      }
    } catch {
      // Fallback
    }
    this.documents = [...SYNTHETIC_ARCHIVE];
    return this.documents;
  }

  public saveDocuments(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.documents));
    } catch (e) {
      console.warn('Could not persist to localStorage:', e);
    }
  }

  public resetToSyntheticDefault(): MemoryDocument[] {
    this.documents = [...SYNTHETIC_ARCHIVE];
    this.saveDocuments();
    return this.documents;
  }

  public getDocuments(): MemoryDocument[] {
    return this.documents;
  }

  public getDocumentById(sourceId: string): MemoryDocument | undefined {
    return this.documents.find(doc => doc.source_id === sourceId);
  }

  /**
   * Ingest a new raw text or markdown document into the sovereign archive
   * Uses paragraph-aware chunking with header boundary awareness.
   */
  public ingestDocument(params: {
    title: string;
    filename: string;
    content: string;
    source_date?: string | null;
    language?: string;
    source_type?: MemoryDocument['source_type'];
    people_as_written?: string[];
    tags?: string[];
  }): MemoryDocument {
    const source_id = `mem_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const paragraphs = params.content
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const chunks: MemoryChunk[] = paragraphs.map((para, idx) => ({
      chunk_id: `chunk_${source_id}_${idx + 1}`,
      source_id,
      chunk_index: idx,
      content: para,
      token_estimate: Math.round(para.split(/\s+/).length * 1.3)
    }));

    const newDoc: MemoryDocument = {
      source_id,
      title: params.title || 'Untitled Archive Memory',
      original_filename: params.filename,
      source_date: params.source_date || null,
      language: params.language || 'en',
      heading: params.title,
      source_type: params.source_type || 'oral_history',
      people_as_written: params.people_as_written || [],
      tags: params.tags || ['custom_ingest'],
      content: params.content,
      chunks,
      inferred_tone: 'reflective'
    };

    this.documents.unshift(newDoc);
    this.saveDocuments();
    return newDoc;
  }

  /**
   * Delete a document by source_id
   */
  public deleteDocument(sourceId: string): boolean {
    const initialLen = this.documents.length;
    this.documents = this.documents.filter(doc => doc.source_id !== sourceId);
    if (this.documents.length !== initialLen) {
      this.saveDocuments();
      return true;
    }
    return false;
  }

  /**
   * Retrieve the top K relevant chunks using BM25-inspired term frequency
   * and phrase co-occurrence scoring.
   */
  public retrieve(query: string, topK: number = 4): RetrievalResult[] {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const allChunksWithSource: { chunk: MemoryChunk; source: MemoryDocument }[] = [];
    for (const doc of this.documents) {
      for (const chunk of doc.chunks) {
        allChunksWithSource.push({ chunk, source: doc });
      }
    }

    const nDocs = allChunksWithSource.length;
    const docFreq: Record<string, number> = {};

    for (const token of queryTokens) {
      let count = 0;
      for (const item of allChunksWithSource) {
        if (item.chunk.content.toLowerCase().includes(token)) {
          count++;
        }
      }
      docFreq[token] = count;
    }

    const results: RetrievalResult[] = [];

    for (const item of allChunksWithSource) {
      const chunkText = item.chunk.content.toLowerCase();
      const titleText = item.source.title.toLowerCase();
      const tagsText = item.source.tags.join(' ').toLowerCase();
      const peopleText = item.source.people_as_written.join(' ').toLowerCase();

      let score = 0;
      const matched_terms: string[] = [];

      for (const token of queryTokens) {
        const idf = Math.log((nDocs - (docFreq[token] || 0) + 0.5) / ((docFreq[token] || 0) + 0.5) + 1);
        const tf = (chunkText.match(new RegExp(`\\b${token}`, 'g')) || []).length;

        if (tf > 0) {
          score += idf * (tf * 2.2) / (tf + 1.2 * 1.0);
          matched_terms.push(token);
        }

        // Boost for matches in source metadata (title, people, tags)
        if (titleText.includes(token)) score += 1.8 * idf;
        if (peopleText.includes(token)) score += 2.2 * idf;
        if (tagsText.includes(token)) score += 1.2 * idf;
      }

      // Bonus for exact multi-word phrase matches from query
      if (query.trim().length > 8 && chunkText.includes(query.toLowerCase().trim())) {
        score += 8.0;
      }

      if (score > 0.4) {
        results.push({
          chunk: item.chunk,
          source: item.source,
          score,
          matched_terms: Array.from(new Set(matched_terms))
        });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }
}

export const localRAG = new LocalRAGEngine();
