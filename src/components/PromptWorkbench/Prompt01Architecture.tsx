/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Prompt 01: Core AI Architecture
 */

import React, { useState } from 'react';
import { Network, Server, HardDrive, Cpu, ShieldAlert, ArrowRight, Check } from 'lucide-react';

export const Prompt01Architecture: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'query' | 'ingest' | 'health'>('query');

  const pipelineSteps = [
    { step: 1, title: 'User Question', desc: 'Natural language memorial query', icon: 'I' },
    { step: 2, title: 'Local Embedding', desc: 'all-MiniLM-L6-v2 (384-dim, ONNX runtime)', icon: 'II' },
    { step: 3, title: 'SQLite-vec', desc: 'Local cosine vector index search', icon: 'III' },
    { step: 4, title: 'Context Window', desc: 'Top-4 paragraph chunks in <archive_context>', icon: 'IV' },
    { step: 5, title: 'Gemma 2B/9B', desc: 'Reasoning Scratchpad + Structured JSON', icon: 'V' },
    { step: 6, title: 'Sentiment Filter', desc: 'Bounded tone parameters', icon: 'VI' },
    { step: 7, title: '3D WebGL Altar', desc: 'Three.js lighting, petals, camera damping', icon: 'VII' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl shadow-xl">
        <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
          Prompt 01 • Architecture Specification
        </div>
        <h2 className="text-xl font-serif font-bold text-stone-100">
          Local-First Sovereign AI Processing Pipeline
        </h2>
        <p className="text-xs text-stone-400 mt-1 leading-relaxed">
          Stateless, offline-capable architecture designed for standard consumer hardware (CPU or consumer GPU).
        </p>
      </div>

      {/* Interactive Pipeline Diagram */}
      <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-serif font-bold text-amber-200 flex items-center gap-2">
          <Network className="w-4 h-4 text-amber-400" />
          Dataflow Pipeline (User Question to 3D State)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center">
          {pipelineSteps.map((s, idx) => (
            <React.Fragment key={s.step}>
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-3 text-center space-y-1 relative group hover:border-amber-600/70 transition">
                <span className="text-xl block">{s.icon}</span>
                <span className="text-[10px] font-mono text-amber-400 block font-bold">Step {s.step}</span>
                <span className="text-xs font-semibold text-stone-200 block truncate">{s.title}</span>
                <p className="text-[10px] text-stone-400 line-clamp-2 leading-tight">{s.desc}</p>
              </div>

              {idx < pipelineSteps.length - 1 && (
                <div className="hidden md:flex justify-center text-amber-500/60">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* FastAPI Endpoint Contracts */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-amber-200 flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-400" />
            FastAPI Backend Contracts (Stateless Pydantic v2)
          </h3>
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs font-mono">
            <button
              onClick={() => setSelectedEndpoint('query')}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                selectedEndpoint === 'query' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400'
              }`}
            >
              POST /memories/query
            </button>
            <button
              onClick={() => setSelectedEndpoint('ingest')}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                selectedEndpoint === 'ingest' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400'
              }`}
            >
              POST /archives/ingest
            </button>
            <button
              onClick={() => setSelectedEndpoint('health')}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                selectedEndpoint === 'health' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400'
              }`}
            >
              GET /health
            </button>
          </div>
        </div>

        {selectedEndpoint === 'query' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <span className="text-[11px] text-amber-400 font-bold block uppercase tracking-wider">Request Payload (Pydantic Schema):</span>
              <pre className="text-stone-300 text-[11px] overflow-x-auto">{`{
  "question": "Which four dried chilies did Elena use in her mole?",
  "top_k": 4,
  "client_state": {
    "current_camera": "overview",
    "active_nicho_id": null
  }
}`}</pre>
            </div>
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <span className="text-[11px] text-emerald-400 font-bold block uppercase tracking-wider">Response Payload (Gemma Output):</span>
              <pre className="text-stone-300 text-[11px] overflow-x-auto">{`{
  "schema_version": "1.0",
  "reasoning_scratchpad": "Found chunk_001_1. Explicit match for Ancho, Pasilla, Mulato, Chipotle meco.",
  "status": "answered",
  "answer": "Abuela Elena's recipe notebook specifies four dried chilies: Ancho, Pasilla, Mulato, and Chipotle meco.",
  "evidence_used": ["chunk_001_1"],
  "visual_direction": {
    "memory_tone": "joyful",
    "tone_confidence": 0.92,
    "lighting_profile": "warm_candle",
    "particle_profile": "petal_drift",
    "camera_motion": "slow_drift"
  }
}`}</pre>
            </div>
          </div>
        )}

        {selectedEndpoint === 'ingest' && (
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs font-mono space-y-2">
            <span className="text-[11px] text-amber-400 font-bold block uppercase tracking-wider">Document Ingestion Contract:</span>
            <pre className="text-stone-300 text-[11px] overflow-x-auto">{`POST /api/v1/archives/ingest
Content-Type: multipart/form-data or JSON

{
  "filename": "grandfather_letters_1974.md",
  "content": "Raw markdown or text content...",
  "source_date": "1974-12-01",
  "language": "es-MX",
  "people_as_written": ["Mateo Reyes", "Elena"]
}
=> Generates paragraph-aware chunks, creates sqlite-vec vectors, updates local index.`}</pre>
          </div>
        )}

        {selectedEndpoint === 'health' && (
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs font-mono space-y-2">
            <span className="text-[11px] text-amber-400 font-bold block uppercase tracking-wider">Local Runtime Health Check:</span>
            <pre className="text-stone-300 text-[11px] overflow-x-auto">{`GET /api/health
{
  "status": "ok",
  "model_runtime": "llama.cpp / ollama",
  "model_name": "gemma-2-9b-it.Q4_K_M.gguf",
  "vector_db": "sqlite-vec (local)",
  "vector_count": 28,
  "vram_usage_mb": 5600,
  "ram_usage_mb": 1450
}`}</pre>
          </div>
        )}
      </div>

      {/* Hardware & Risk Register */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-stone-900 border border-stone-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold font-serif">
            <Cpu className="w-4 h-4" />
            <span>Target Hardware Footprint</span>
          </div>
          <ul className="space-y-1.5 text-stone-300">
            <li>• <strong>Gemma 2B (Q4_K_M)</strong>: ~1.8 GB RAM. Runs 35+ tok/s on standard CPU.</li>
            <li>• <strong>Gemma 9B (Q4_K_M)</strong>: ~5.8 GB VRAM or 8 GB RAM. Recommended for production.</li>
            <li>• <strong>Local Embeddings</strong>: <code className="bg-stone-800 px-1 py-0.5 rounded text-amber-200">all-MiniLM-L6-v2</code> requires only ~80 MB RAM.</li>
            <li>• <strong>Storage</strong>: SQLite file on disk with <code className="bg-stone-800 px-1 py-0.5 rounded text-amber-200">sqlite-vec</code> extension. Zero background daemon.</li>
          </ul>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold font-serif">
            <ShieldAlert className="w-4 h-4" />
            <span>Risk Register & Mitigations</span>
          </div>
          <ul className="space-y-1.5 text-stone-300">
            <li>• <strong>JSON Truncation on Small Models</strong>: Mitigated via CoT scratchpad and GBNF grammars.</li>
            <li>• <strong>Hallucination on Empty Retrieval</strong>: Mitigated via mandatory score cutoff (&lt;0.8 = abstain).</li>
            <li>• <strong>Adversarial Untrusted Data</strong>: Mitigated via XML wrapping and strict system prompt boundary.</li>
            <li>• <strong>UI Occlusion</strong>: Mitigated by collapsible bottom dock (&lt;= 15% viewport).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
